import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

export type IpfsContent = {
  cid: string;
  dataURL: string;
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

export default ipfsContentsSlice.reducer;
