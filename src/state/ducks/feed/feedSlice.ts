import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '~/state/store';
import { Message } from '../places/messagesSlice';
import { Place } from '../places/placesSlice';

export enum Appearance {
  DEFAULT,
  BIG_CARD,
}

export enum ItemKind {
  MESSAGE,
  PLACE,
}

export interface FeedItemMessage extends Message {
  appearance: Appearance,
  kind: ItemKind.MESSAGE,
  placeId: string,
};

export interface FeedItemPlace extends Place {
  appearance: Appearance,
  kind: ItemKind.PLACE,
};

export type FeedItem = FeedItemMessage | FeedItemPlace;

export type FeedsState = {
  items: FeedItem[];
};

export const fetchFeedItems = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch; state: RootState }
>('feed/fetchFeedItems', async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const dispatch = thunkAPI.dispatch;

  // TODO fetching from the GraphQL endpoint.
  dispatch(appendFeedItems([{
    appearance: Appearance.BIG_CARD,
    kind: ItemKind.MESSAGE,
    placeId: '22222-22222-22222-2222222222',

    id: '33333-33333-33333-3333333333',
    authorId: '55555-55555-55555-5555555555',
    authorName: 'hogehgoe',
    postedAt: 10000010,
    attachments: [{
      ipfsCid: '5555555555555555555',
      dataUrl: '11111111111111111111111111',
    }],
    text: 'Liverpool will be back in action on Monday night when they take on Wolverhampton Wanderers at Molineux Stadium in the Premier...',
  }, {
    appearance: Appearance.BIG_CARD,
    kind: ItemKind.MESSAGE,
    placeId: '22222-22222-22222-2222222222',

    id: '33333-33333-33333-3333333333',
    authorId: '55555-55555-55555-5555555555',
    authorName: 'hogehgoe',
    postedAt: 10000010,
    attachments: [{
      ipfsCid: '5555555555555555555',
      dataUrl: '11111111111111111111111111',
    }],
    text: 'Liverpool will be back in action on Monday night when they take on Wolverhampton Wanderers at Molineux Stadium in the Premier...',
  }, {
    appearance: Appearance.DEFAULT,
    kind: ItemKind.MESSAGE,
    placeId: '22222-22222-22222-2222222222',

    id: '33333-33333-33333-3333333333',
    authorId: '55555-55555-55555-5555555555',
    authorName: 'hogehgoe',
    postedAt: 10000010,
    attachments: [{
      ipfsCid: '5555555555555555555',
      dataUrl: '11111111111111111111111111',
    }],
    text: 'Liverpool will be back in action on Monday night when they take on Wolverhampton Wanderers at Molineux Stadium in the Premier...',
  }, {
    appearance: Appearance.BIG_CARD,
    kind: ItemKind.MESSAGE,
    placeId: '22222-22222-22222-2222222222',

    id: '33333-33333-33333-3333333333',
    authorId: '55555-55555-55555-5555555555',
    authorName: 'hogehgoe',
    postedAt: 10000010,
    attachments: [{
      ipfsCid: '5555555555555555555',
      dataUrl: '11111111111111111111111111',
    }],
    text: 'Liverpool will be back in action on Monday night when they take on Wolverhampton Wanderers at Molineux Stadium in the Premier...',
  }, {
    appearance: Appearance.DEFAULT,
    kind: ItemKind.MESSAGE,
    placeId: '22222-22222-22222-2222222222',

    id: '33333-33333-33333-3333333333',
    authorId: '55555-55555-55555-5555555555',
    authorName: 'hogehgoe',
    postedAt: 10000010,
    attachments: [{
      ipfsCid: '5555555555555555555',
      dataUrl: '11111111111111111111111111',
    }],
    text: 'Liverpool will be back in action on Monday night when they take on Wolverhampton Wanderers at Molineux Stadium in the Premier...',
  }]))
});

const initialState: FeedsState = {
  items: [],
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    appendFeedItems: (state, action: PayloadAction<FeedItem[]>) => {
      state.items = [...state.items, ...action.payload];
    },
  },
});

export const { appendFeedItems } = feedSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
// export const incrementAsync = (amount: number): AppThunk => dispatch => {
//   setTimeout(() => {
//     dispatch(incrementByAmount(amount));
//   }, 1000);
// };

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
// export const selectCount = (state: RootState) => state.counter.value;
export const selectFeed = (state: RootState): typeof state.feed => state.feed;

export default feedSlice.reducer;
