import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  EntityId,
  PayloadAction,
} from '@reduxjs/toolkit';
import { default as arrayUnique } from 'array-unique';
import { push } from 'connected-react-router';
import { getUnixTime } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { createMessageFeed } from '~/lib/db/message';
import {
  connectPlaceKeyValue,
  createPlaceKeyValue,
  readPlaceFromDB,
} from '~/lib/db/place';
import {
  placeAdded,
  placeMessageAdded,
  placeMessagesAdded,
  placeUpdated,
} from '~/state/actionCreater';
import { AppDispatch, AppThunkDispatch, RootState } from '~/state/store';
import { digestMessage } from '~/utils/digest-message';
import { addIpfsContent } from '../p2p/ipfsContentsSlice';
import { connectToMessages, Message, selectMessageById } from './messagesSlice';
import { PartialForUpdate, Place, PlaceField, PlacePermission } from './type';

const MODULE_NAME = 'places';

export const categories = [
  'DISCUSSION_AND_STORIES',
  'EMOTIONAL_REACTION_FUEL',
  'ENTERTAINMENT_GAMING',
  'ENTERTAINMENT_TELEVISION',
  'ENTERTAINMENT_OTHER',
  'HUMOR',
  'IMAGES_GIFS_AND_VIDEOS',
  'LEARNING_AND_THINKING',
  'LIFESTYLE_AND_HELP',
  'NEWS_AND_ISSUES',
  'TRAVEL',
  'RACE_GENDER_AND_IDENTITY',
  'SPORTS',
  'TECHNOLOGY',
];
export const categoryOptions = categories.map((label, index) => ({
  value: `${index}`,
  label,
}));

const messageSort = (a: Message, b: Message): number =>
  a.timestamp - b.timestamp;

const placesAdapter = createEntityAdapter<Place>({
  sortComparer: (a, b) => a.timestamp - b.timestamp,
});

const requiredPlaceFields: PlaceField[] = [
  'id',
  'name',
  'description',
  'avatarCid',
  'passwordRequired',
  'readOnly',
  'createdAt',
  'category',
  'timestamp',
  'messageIds',
  'unreadMessages',
  'permissions',
  'feedAddress',
  'keyValAddress',
  'bannedUsers',
];

const checkPlaceValues = (place: Partial<Place>): place is Place => {
  return requiredPlaceFields.some((key) => place[key] === undefined) === false;
};

export const joinPlace = createAsyncThunk<
  void,
  { placeId: string; address: string }
>(`${MODULE_NAME}/join`, async ({ placeId, address }, thunkAPI) => {
  const { dispatch } = thunkAPI;
  const kv = await connectPlaceKeyValue({
    placeId,
    address,
    onReplicated: (_kv) => {
      const place = readPlaceFromDB(_kv);
      if (checkPlaceValues(place)) {
        dispatch(placeUpdated(place));
      }
    },
  });

  const place = readPlaceFromDB(kv);

  if (checkPlaceValues(place)) {
    dispatch(placeUpdated(place));
  }
});

export const openProtectedPlace = createAsyncThunk<
  void,
  { placeId: string; password: string },
  { dispatch: AppThunkDispatch; state: RootState }
>(
  `${MODULE_NAME}/openProtectedPlace`,
  async ({ placeId, password }, { dispatch, getState }) => {
    const state = getState();
    const place = selectPlaceById(placeId)(state);

    if (!place) {
      throw new Error(`place: ${placeId} is not found.`);
    }

    const hash = await digestMessage(password);
    dispatch(setHash({ placeId, hash }));
    await dispatch(
      connectToMessages({ placeId, address: place.feedAddress, hash })
    );
  }
);

export const banUser = createAsyncThunk<
  void,
  { placeId: string; userId: string },
  { state: RootState }
>(`${MODULE_NAME}/ban`, async ({ placeId, userId }, { getState }) => {
  const state = getState();
  const place = selectPlaceById(placeId)(state);

  if (place) {
    const placeDB = await connectPlaceKeyValue({
      placeId,
      address: place.keyValAddress,
    });

    const bannedUsers = placeDB.get('bannedUsers') as string[];
    await placeDB.set('bannedUsers', arrayUnique(bannedUsers.concat(userId)));
  }
});

export const unbanUser = createAsyncThunk<
  string[],
  { placeId: string; userId: string },
  { state: RootState }
>(`${MODULE_NAME}/unban`, async ({ placeId, userId }, { getState }) => {
  const state = getState();
  const place = selectPlaceById(placeId)(state);

  if (!place) {
    throw new Error('Place not found');
  }
  const placeDB = await connectPlaceKeyValue({
    placeId,
    address: place.keyValAddress,
  });

  const updatedList = place.bannedUsers.filter((id) => id !== userId);
  await placeDB.set('bannedUsers', updatedList);

  return updatedList;
});

export const createNewPlace = createAsyncThunk<
  void,
  {
    name: string;
    category: number;
    description: string;
    isPrivate: boolean;
    avatar: File;
    password: string;
    readOnly: boolean;
  },
  { dispatch: AppDispatch; state: RootState }
>(
  'places/createNewPlace',
  async (
    { name, description, isPrivate, avatar, password, category, readOnly },
    { dispatch, getState }
  ) => {
    const { me } = getState();

    const cid = await addIpfsContent(dispatch, avatar);

    let swarmKey;
    if (isPrivate) {
      // TODO private swarm
      // const swarmKey = uuidv4()
      // p2pNodes.privateIpfsNodes[id] = await IPFS.create({})
    }

    const placeId = uuidv4();
    const passwordRequired = !!password;
    const placeKeyValue = await createPlaceKeyValue(placeId);
    const hash = password ? await digestMessage(password) : undefined;
    const feed = await createMessageFeed({
      placeId,
      hash,
      onMessageAdd: createMessageReceiveHandler({
        dispatch,
        placeId,
        myId: me.id,
      }),
    });

    const timestamp = getUnixTime(new Date());

    const place: Place = {
      id: placeId,
      keyValAddress: placeKeyValue.address.root,
      feedAddress: feed.address.root,
      name,
      description,
      avatarCid: cid,
      timestamp: timestamp,
      createdAt: timestamp,
      swarmKey: swarmKey || undefined,
      passwordRequired,
      hash,
      category,
      messageIds: [],
      unreadMessages: [],
      readOnly,
      permissions: { [me.id]: PlacePermission.AUTHOR },
      bannedUsers: [],
    };

    await Promise.all(
      Object.keys(place).map((key) => {
        if (key === 'hash') {
          Promise.resolve(); // Do not add hash to the place db.
        }
        const v = place[key as keyof Place];
        if (v === undefined) {
          return Promise.resolve();
        }
        return placeKeyValue.put(key, v);
      })
    );

    dispatch(placeAdded({ place, messages: [] }));
    dispatch(push(`/places/${placeKeyValue.address.root}/${placeId}`));
  }
);

const excludeMyMessages = (uid: string, messages: Message[]): Message[] => {
  return messages.filter((m) => m.uid !== uid);
};

const createMessageReceiveHandler =
  ({
    dispatch,
    placeId,
    myId,
  }: {
    dispatch: AppThunkDispatch;
    placeId: string;
    myId: string;
  }) =>
  (messages: Message[]): void => {
    dispatch(
      placeMessagesAdded({
        placeId,
        messages: excludeMyMessages(myId, messages),
      })
    );
  };

export const updatePlace = createAsyncThunk<
  void,
  {
    placeId: string;
    address: string;
    name: string;
    category: number;
    description: string;
    avatar: File;
  },
  { dispatch: AppDispatch; state: RootState }
>(
  'places/updatePlace',
  async (
    { placeId, address, name, description, avatar, category },
    { dispatch }
  ) => {
    const cid = await addIpfsContent(dispatch, avatar);

    const placeKeyValue = await connectPlaceKeyValue({ placeId, address });

    const place: PartialForUpdate = {
      name,
      description,
      avatarCid: cid,
      category,
    };

    await Promise.all(
      Object.keys(place).map((key) => {
        const v = place[key as keyof PartialForUpdate];
        if (v === undefined) {
          return Promise.resolve();
        }
        return placeKeyValue.put(key, v);
      })
    );

    dispatch(updateOne({ placeId, changes: place }));
    dispatch(push(`/places/${placeKeyValue.address.root}/${placeId}`));
  }
);

export const placesSlice = createSlice({
  name: 'places',
  initialState: placesAdapter.getInitialState(),
  reducers: {
    clearUnreadMessages(state, action: PayloadAction<string>) {
      const place = state.entities[action.payload];
      if (place) {
        place.unreadMessages = [];
      }
    },
    setHash(state, action: PayloadAction<{ placeId: string; hash: string }>) {
      const { placeId, hash } = action.payload;
      const place = state.entities[placeId];
      if (place) {
        place.hash = hash;
      }
    },
    removePlace(state, action: PayloadAction<{ placeId: string }>) {
      placesAdapter.removeOne(state, action.payload.placeId);
      // TODO expire the messages in the place user left
    },
    updateOne(
      state,
      action: PayloadAction<{ placeId: string; changes: PartialForUpdate }>
    ) {
      placesAdapter.updateOne(state, {
        id: action.payload.placeId,
        changes: action.payload.changes,
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeUpdated, (state, action) => {
        placesAdapter.upsertOne(state, {
          ...action.payload,
          messageIds: state.entities[action.payload.id]?.messageIds || [],
        });
      })
      .addCase(placeMessageAdded, (state, action) => {
        const { placeId, message, mine } = action.payload;
        const currentPlace = state.entities[placeId];
        if (currentPlace === undefined) {
          throw new Error('Place is not exists');
        }
        const newPlace: Place = { ...currentPlace };
        newPlace.messageIds = [...(newPlace.messageIds || []), message.id];
        if (mine === false) {
          newPlace.unreadMessages = newPlace.unreadMessages
            ? [...newPlace.unreadMessages, message.id]
            : [message.id];
        }
        if (newPlace.timestamp < message.timestamp) {
          newPlace.timestamp = message.timestamp;
        }
        placesAdapter.updateOne(state, { id: placeId, changes: newPlace });
      })
      .addCase(placeMessagesAdded, (state, action) => {
        const { placeId, messages } = action.payload;
        const place = state.entities[placeId];

        if (place) {
          const ids = messages.sort(messageSort).map((message) => message.id);
          place.messageIds = [...new Set(place.messageIds.concat(ids))];
          place.unreadMessages = [...new Set(place.unreadMessages.concat(ids))];
        }
      })
      .addCase(placeAdded, (state, action) => {
        const { place, messages } = action.payload;
        place.messageIds = messages.map((message) => message.id);
        if (place) {
          placesAdapter.addOne(state, place);
        }
      })
      .addCase(banUser.fulfilled, (state, action) => {
        state.entities[action.meta.arg.placeId]?.bannedUsers.push(
          action.meta.arg.userId
        );
      })
      .addCase(unbanUser.fulfilled, (state, action) => {
        placesAdapter.updateOne(state, {
          id: action.meta.arg.placeId,
          changes: { bannedUsers: action.payload },
        });
      })
      .addCase(connectToMessages.fulfilled, (state, action) => {
        const place = state.entities[action.meta.arg.placeId];

        if (place) {
          place.messageIds = arrayUnique(
            action.payload.map((m) => m.id).concat(place.messageIds)
          );
        }
      })
      .addCase(connectToMessages.rejected, (state, action) => {
        if (action.meta.arg.hash) {
          placesAdapter.updateOne(state, {
            id: action.meta.arg.placeId,
            changes: { hash: undefined },
          });
        }
      });
  },
});

const selectors = placesAdapter.getSelectors();
export const selectPlaceById =
  (id: string) =>
  (state: RootState): Place | undefined =>
    selectors.selectById(state.places, id);

export const selectAllPlaces = (state: RootState): Place[] =>
  selectors.selectAll(state.places);

export const selectPlaceIds = (state: RootState): EntityId[] =>
  selectors.selectIds(state.places);

export const selectPlaceMessagesByPlaceId =
  (placeId: string) =>
  (state: RootState): Message[] => {
    const place = selectors.selectById(state.places, placeId);

    if (!place) {
      return [];
    }

    return place.messageIds
      .map((id) => selectMessageById(state.placeMessages, id))
      .filter(Boolean) as Message[];
  };

export const { clearUnreadMessages, setHash, removePlace, updateOne } =
  placesSlice.actions;

export default placesSlice.reducer;
