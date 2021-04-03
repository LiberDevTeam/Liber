import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '~/state/store';
import FileType, { FileTypeResult } from 'file-type/browser';
import toStream from 'it-to-stream';
import { getIpfsNode } from './p2pSlice';
import { readAsDataURL } from '~/lib/readFile';

export interface IpfsContent {
  cid: string;
  dataUrl?: string;
  fileType: FileTypeResult;
}

const ipfsContentsAdapter = createEntityAdapter<IpfsContent>({
  selectId: (content) => content.cid,
});

export const addIpfsContent = createAsyncThunk<
  void,
  { cid: string },
  { dispatch: AppDispatch }
>('ipfsContents/addIpfsContent', async ({ cid }, { dispatch }) => {
  const uint8arr = await readUint8Array(
    (await getIpfsNode()).cat(cid, { length: 24 })
  );
  const fileType = await FileType.fromBlob(new Blob(uint8arr));
  if (!fileType) {
    throw new Error('unsupported file format');
  }

  console.log(fileType);
  console.log(cid);

  let dataUrl;
  if (
    fileType.mime.includes('image/') /* || fileType.mime.includes('audio/') */
  ) {
    const uint8arr = await readUint8Array((await getIpfsNode()).cat(cid));
    dataUrl = await readAsDataURL(new Blob(uint8arr));
  }
  dispatch(
    ipfsContentAdded({
      cid,
      fileType,
      dataUrl,
    })
  );
});

const readUint8Array = async (array: AsyncIterable<Uint8Array>) => {
  const uint8arr = [];
  for await (const partial of array) {
    uint8arr.push(partial);
  }
  return uint8arr;
};

export const ipfsContentsSlice = createSlice({
  name: 'ipfsContents',
  initialState: ipfsContentsAdapter.getInitialState(),
  reducers: {
    ipfsContentAdded(state, action: PayloadAction<IpfsContent>) {
      ipfsContentsAdapter.addOne(state, action.payload);
    },
  },
});

export const { ipfsContentAdded } = ipfsContentsSlice.actions;

const selectors = ipfsContentsAdapter.getSelectors();
export const selectIpfsContentByCID = (cid: string) => (
  state: RootState
): IpfsContent | undefined => selectors.selectById(state.ipfsContents, cid);

export default ipfsContentsSlice.reducer;
