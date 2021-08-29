import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  EntityId,
  PayloadAction,
} from '@reduxjs/toolkit';
import { default as arrayUnique } from 'array-unique';
import getUnixTime from 'date-fns/getUnixTime';
import { history } from '~/history';
import {
  placeAdded,
  placeMessagesAdded,
  placeUpdated,
} from '~/state/actionCreator';
import { addReaction, connectToMessages } from '~/state/places/async-actions';
import { AppDispatch, RootState, ThunkExtra } from '~/state/store';
import { digestMessage } from '~/utils/digest-message';
import { addIpfsContent } from '../p2p/ipfsContentsSlice';
import { selectMessageById } from './messagesSlice';
import { Message, PartialForUpdate, Place } from './type';

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

export const openProtectedPlace = createAsyncThunk<
  void,
  { placeId: string; password: string },
  { dispatch: AppDispatch; state: RootState }
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
  { state: RootState; extra: ThunkExtra }
>(`${MODULE_NAME}/ban`, async ({ placeId, userId }, { getState, extra }) => {
  const state = getState();
  const place = selectPlaceById(placeId)(state);

  if (place) {
    const placeDB = await extra.db.place.connect({
      placeId,
      address: place.keyValAddress,
    });

    const bannedUsers = placeDB.get('bannedUsers') as string[];
    await placeDB.set('bannedUsers', arrayUnique(bannedUsers.concat(userId)));
  }
});

export const toggleBot = createAsyncThunk<
  string[],
  { placeId: string; botId: string; value: boolean },
  { state: RootState; extra: ThunkExtra }
>(
  `${MODULE_NAME}/toggle-bot`,
  async ({ placeId, botId, value }, { getState, extra }) => {
    const state = getState();
    const place = selectPlaceById(placeId)(state);

    if (!place) {
      throw new Error('Place not found');
    }

    const placeDB = await extra.db.place.connect({
      placeId,
      address: place.keyValAddress,
    });
    let bots = (placeDB.get('bots') as string[]) || [];

    if (value) {
      bots = arrayUnique(bots.concat(botId));
    } else {
      bots = bots.filter((id) => id !== botId);
    }

    await placeDB.set('bots', bots);
    return bots;
  }
);

export const unbanUser = createAsyncThunk<
  string[],
  { placeId: string; userId: string },
  { state: RootState; extra: ThunkExtra }
>(`${MODULE_NAME}/unban`, async ({ placeId, userId }, { getState, extra }) => {
  const state = getState();
  const place = selectPlaceById(placeId)(state);

  if (!place) {
    throw new Error('Place not found');
  }
  const placeDB = await extra.db.place.connect({
    placeId,
    address: place.keyValAddress,
  });

  const updatedList = place.bannedUsers.filter((id) => id !== userId);
  await placeDB.set('bannedUsers', updatedList);

  return updatedList;
});

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
  { dispatch: AppDispatch; state: RootState; extra: ThunkExtra }
>(
  `${MODULE_NAME}/updatePlace`,
  async (
    { placeId, address, name, description, avatar, category },
    { dispatch, extra }
  ) => {
    const cid = await addIpfsContent(avatar);

    const placeKeyValue = await extra.db.place.connect({ placeId, address });

    const partial: PartialForUpdate = {
      name,
      description,
      avatarCid: cid,
      category,
    };

    await Promise.all(
      Object.keys(partial).map((key) => {
        const v = partial[key as keyof PartialForUpdate];
        if (v === undefined) {
          return Promise.resolve();
        }
        return placeKeyValue.put(key, v);
      })
    );

    const explorePlaceDB = await extra.db.explorePlace.connect();
    const key = `/${explorePlaceDB.identity.publicKey}/${address}/${placeId}`;
    const place = explorePlaceDB.get(key);
    const newPlace = {
      ...place,
      ...partial,
    };
    const keystore = explorePlaceDB.identity.provider.keystore;
    await explorePlaceDB.put(key, {
      signature: await keystore.sign(
        await keystore.getKey(explorePlaceDB.identity.id),
        JSON.stringify(newPlace)
      ),
      ...newPlace,
    });

    dispatch(updateOne({ placeId, changes: partial }));
    history.push(`/places/${placeKeyValue.address.root}/${placeId}`);
  }
);

export const placesSlice = createSlice({
  name: MODULE_NAME,
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
      .addCase(placeMessagesAdded, (state, action) => {
        const { placeId, messages } = action.payload;
        const place = state.entities[placeId];

        if (!place) {
          return;
        }

        const sortedMessages = messages.sort(messageSort);

        const ids = sortedMessages.map((message) => message.id);
        place.messageIds = arrayUnique(place.messageIds.concat(ids));
        if (sortedMessages.length === 0) {
          place.timestamp = getUnixTime(new Date());
        } else {
          place.timestamp = sortedMessages[sortedMessages.length - 1].timestamp;
        }
        // TODO: update unread message
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
      })
      .addCase(toggleBot.fulfilled, (state, action) => {
        placesAdapter.updateOne(state, {
          id: action.meta.arg.placeId,
          changes: { bots: action.payload },
        });
      })
      .addCase(addReaction.fulfilled, (state, action) => {
        placesAdapter.updateOne(state, {
          id: action.meta.arg.placeId,
          changes: { reactions: action.payload },
        });
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
