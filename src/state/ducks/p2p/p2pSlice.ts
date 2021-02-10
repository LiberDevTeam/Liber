import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '~/state/store';
import IPFS, { IPFS as Ipfs } from 'ipfs';
import Libp2p from 'libp2p';
import { createLibp2pNode, createPnetLibp2pNode } from '~/lib/libp2p';

export type P2PState = {
  ipfsNode: Ipfs | null;
  publicLibp2pNode: Libp2p | null;
  privateLibp2pNodes: Record<string, Libp2p>;
};

export const initNodes = createAsyncThunk<
  P2PState,
  void,
  { dispatch: AppDispatch; state: RootState }
>('p2p/initNodes', async (_, thunkAPI) => {
  const { places } = thunkAPI.getState().place;

  const publicLibp2pNode = await createLibp2pNode();

  const privateLibp2pNodes: Record<string, Libp2p> = {};
  Object.keys(places)
    .filter((pid) => places[pid].isPrivate)
    .forEach(async (pid) => {
      privateLibp2pNodes[pid] = await createPnetLibp2pNode();
    });

  const ipfsNode = await IPFS.create();

  return {
    ipfsNode,
    publicLibp2pNode,
    privateLibp2pNodes,
  };
});

const initialState: P2PState = {
  ipfsNode: null,
  publicLibp2pNode: null,
  privateLibp2pNodes: {},
};

export const p2pSlice = createSlice({
  name: 'p2p',
  initialState,
  reducers: {},
});

// export const { } = p2pSlice.actions;

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
export const selectP2P = (state: RootState): typeof state.me => state.me;

export default p2pSlice.reducer;
