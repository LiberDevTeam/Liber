import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '~/state/store';

interface ApplicationState {
  showDrawer: boolean;
}

const initialState: ApplicationState = {
  showDrawer: false,
};

export const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    toggleDrawer: (state) => {
      state.showDrawer = !state.showDrawer;
    },
  },
});

export const { toggleDrawer } = applicationSlice.actions;

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
export const selectApplication = (state: RootState): ApplicationState =>
  state.application;

export default applicationSlice.reducer;
