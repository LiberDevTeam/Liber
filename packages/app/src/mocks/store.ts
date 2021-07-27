import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { RootState } from '~/state/store';

export const createMockStore = configureStore<Partial<RootState>>([thunk]);
