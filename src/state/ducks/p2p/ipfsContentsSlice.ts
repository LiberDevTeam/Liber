import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { RootState } from '~/state/store';

export type IpfsContent = {
  cid: string;
  dataUrl: string;
  file: File;
};

const ipfsContentsAdapter = createEntityAdapter<IpfsContent>({
  selectId: (content) => content.cid,
});

export const ipfsContentsSlice = createSlice({
  name: 'ipfsContents',
  initialState: ipfsContentsAdapter.getInitialState(),
  reducers: {
    ipfsContentAdded: ipfsContentsAdapter.addOne,
  },
});

export const { ipfsContentAdded } = ipfsContentsSlice.actions;

const selectors = ipfsContentsAdapter.getSelectors();
export const selectIpfsContentByCID = (cid: string) => (state: RootState): IpfsContent | undefined =>
  selectors.selectById(state.ipfsContents, cid);

export default ipfsContentsSlice.reducer;
