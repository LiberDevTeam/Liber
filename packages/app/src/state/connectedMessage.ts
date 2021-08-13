import { createSlice } from '@reduxjs/toolkit';
import { connectToMessages } from '~/state/places/async-actions';
import { RootState } from '~/state/store';

export const connectedMessage = createSlice({
  name: 'connectedMessage',
  initialState: {} as Record<string, boolean>,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(connectToMessages.fulfilled, (state, action) => {
      state[action.meta.arg.placeId] = true;
    });
  },
});

export const selectIsMessageConnected = (placeId: string) => (
  state: RootState
): boolean => {
  return state.connectedMessage[placeId] || false;
};
