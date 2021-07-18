import { createAsyncThunk } from '@reduxjs/toolkit';
import { connectMessageFeed, readMessagesFromFeed } from '~/lib/db/message';
import { placeMessagesAdded } from '~/state/actionCreater';
import { Message } from '~/state/places/type';
import { RootState } from '~/state/store';

export const connectToMessages = createAsyncThunk<
  Message[],
  { placeId: string; address: string; hash?: string },
  { state: RootState }
>(
  'placeMessages/connectToMessages',
  async ({ placeId, address, hash }, thunkAPI) => {
    const { dispatch } = thunkAPI;

    const feed = await connectMessageFeed({
      placeId,
      address,
      hash,
      onReceiveEvent: (messages) => {
        if (messages.length > 0) {
          dispatch(placeMessagesAdded({ messages, placeId }));
        }
      },
    });

    return readMessagesFromFeed(feed);
  }
);
