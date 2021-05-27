import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import FileType, { FileTypeResult } from 'file-type/browser';
import { getIpfsNode } from '~/lib/ipfs';
import { readAsDataURL } from '~/lib/readFile';
import { AppDispatch, RootState } from '~/state/store';

export interface IpfsContent {
  cid: string;
  file?: File;
  dataUrl?: string;
  fileType: FileTypeResult;
}

const ipfsContentsAdapter = createEntityAdapter<IpfsContent>({
  selectId: (content) => content.cid,
});

export const addIpfsContent = async (dispatch: AppDispatch, file: File) => {
  const content = await (await getIpfsNode()).add({
    path: file.name,
    content: file,
  });

  const cid = content.cid.toBaseEncodedString();
  const fileType = await FileType.fromStream(file.stream());
  if (!fileType) {
    throw new Error('unsupported file format');
  }
  const dataUrl = await readAsDataURL(file);
  dispatch(
    ipfsContentAdded({
      file,
      cid,
      fileType,
      dataUrl,
    })
  );
  return cid;
};

export const downloadIpfsContent = createAsyncThunk<
  void,
  { cid: string },
  { dispatch: AppDispatch }
>('ipfsContents/downloadIpfsContent', async ({ cid }, { dispatch }) => {
  const uint8arr = await readUint8Array(
    (await getIpfsNode()).cat(cid, { length: 24 })
  );
  const fileType = await FileType.fromBlob(new Blob(uint8arr));
  if (!fileType) {
    throw new Error('unsupported file format');
  }

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
      ipfsContentsAdapter.upsertOne(state, action.payload);
    },
  },
});

export const { ipfsContentAdded } = ipfsContentsSlice.actions;

const selectors = ipfsContentsAdapter.getSelectors();
export const selectIpfsContentByCid = (cid?: string) => (
  state: RootState
): IpfsContent | undefined =>
  cid ? selectors.selectById(state.ipfsContents, cid) : undefined;

export default ipfsContentsSlice.reducer;
