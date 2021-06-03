import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  EntityId,
  PayloadAction,
} from '@reduxjs/toolkit';
import { default as arrayUnique } from 'array-unique';
import { connectPlaceKeyValue, readPlaceFromDB } from '~/lib/db/place';
import {
  placeAdded,
  placeMessageAdded,
  placeMessagesAdded,
  updatePlace,
} from '~/state/actionCreater';
import { AppThunkDispatch, RootState } from '~/state/store';
import { digestMessage } from '~/utils/digest-message';
import { connectToMessages, Message, selectMessageById } from './messagesSlice';
import type { Place, PlaceField } from './type';

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
        dispatch(updatePlace(place));
      }
    },
  });

  const place = readPlaceFromDB(kv);
  if (checkPlaceValues(place)) {
    dispatch(updatePlace(place));
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(updatePlace, (state, action) => {
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

export const { clearUnreadMessages, setHash, removePlace } =
  placesSlice.actions;

export default placesSlice.reducer;
