import { createSlice } from '@reduxjs/toolkit';

export const isInitializedSlice = createSlice({
  name: 'isInitialized',
  initialState: false,
  reducers: {
    finishInitialization() {
      return true;
    },
  },
});

export const { finishInitialization } = isInitializedSlice.actions;
