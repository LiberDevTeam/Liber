import { createAsyncThunk, createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '~/state/store';
import FileType, { FileTypeResult } from 'file-type/browser';
import toStream from 'it-to-stream';
import { ipfsNode } from './p2pSlice';

export interface IpfsContent {
  cid: string;
  dataUrl?: string;
  fileType: FileTypeResult;
};

const ipfsContentsAdapter = createEntityAdapter<IpfsContent>({
  selectId: (content) => content.cid,
});

export const addIpfsContent = createAsyncThunk<
  void,
  { cid: string },
  { dispatch: AppDispatch }
>(
  'ipfsContents/addIpfsContent',
  async ({ cid }, { dispatch }) => {
    const fileType = await FileType.fromStream(toStream(ipfsNode().cat(cid, { length: 24 })))
    if (!fileType) {
      throw new Error('unsupported file format');
    }
    let dataUrl;
    if (fileType.mime.includes('image/') /* || fileType.mime.includes('audio/') */) {
      dataUrl = URL.createObjectURL(ipfsNode().cat(cid)) 
    }
    dispatch(ipfsContentAdded({
      cid,
      fileType,
      dataUrl,
    }))
  }
);

export const ipfsContentsSlice = createSlice({
  name: 'ipfsContents',
  initialState: ipfsContentsAdapter.getInitialState(),
  reducers: {
    ipfsContentAdded(state, action: PayloadAction<IpfsContent>) {
      ipfsContentsAdapter.addOne(state, action.payload);
    }
  },
});

export const { ipfsContentAdded } = ipfsContentsSlice.actions;

const selectors = ipfsContentsAdapter.getSelectors();
export const selectIpfsContentByCID = (cid: string) => (state: RootState): IpfsContent | undefined =>
  selectors.selectById(state.ipfsContents, cid);

export default ipfsContentsSlice.reducer;
