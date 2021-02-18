import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '~/state/store';
import { ipfsContentAdded } from '../p2p/ipfsContentsSlice';
import { ipfsNode } from '../p2p/p2pSlice';
import { Place } from './placesSlice';

export type Message = {
  id: string; // UUID
  authorId: string; // UUID
  authorName?: string;
  postedAt: number;
  text?: string;
  ipfsCID?: string;
  content?: string;
};

export const placeMessagePublished = createAsyncThunk<
  {
    pid: string;
    message: Message;
  },
  {
    pid: string;
    message: Message;
    file?: File;
  },
  { dispatch: AppDispatch; state: RootState }
>('placeMessages/published', async ({ pid, message, file }, thunkAPI) => {
  const { dispatch } = thunkAPI;

  if (file) {
    const content = await ipfsNode().add({
      path: file.name,
      content: file,
    });
    const cid = content.cid.toBaseEncodedString();
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        dispatch(
          ipfsContentAdded({
            cid,
            dataURL: e.target.result as string,
            file,
          })
        );
      }
    };
    reader.readAsDataURL(file);

    message.ipfsCID = cid;
  }

  return {
    pid,
    message,
  };
});

const messagesAdapter = createEntityAdapter<Message>({
  sortComparer: (a, b) => a.postedAt - b.postedAt,
});

export const messagesSlice = createSlice({
  name: 'placeMessages',
  initialState: messagesAdapter.getInitialState(),
  reducers: {
    placeMessageAdded: (
      state,
      action: PayloadAction<{ pid: string; message: Message }>
    ) => {
      messagesAdapter.addOne(state, action.payload.message);
    },
    placeAdded: (
      state,
      action: PayloadAction<{ place: Place; messages: Message[] }>
    ) => {
      messagesAdapter.upsertMany(state, action.payload.messages);
    },
  },
  // extraReducers: (builder) => {
  //   builder.addCase(, (state, action) => {
  //     messagesAdapter.upsertMany(state, action.payload.messages);
  //   });
  // },
});

export const { placeMessageAdded } = messagesSlice.actions;

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

export const selectMessageById = messagesAdapter.getSelectors().selectById;

export default messagesSlice.reducer;
