import React from 'react';
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from 'styled-components';
import { Normalize } from 'styled-normalize';
import '~/lib/i18n';
import { AppThunkDispatch, persistor } from '~/state/store';
import { Routes } from './routes';
import * as serviceWorker from './serviceWorker';
import { initUser } from './state/ducks/me/meSlice';
import { initApp } from './state/ducks/p2p/p2pSlice';
import { store } from './state/store';
import { GlobalStyles, theme } from './theme';

// @ts-ignore
if (NODE_ENV === 'development') {
  const { worker } = require('./mocks/browser');
  worker.start();
}

ReactModal.setAppElement('#root');

async function run() {
  await (store.dispatch as AppThunkDispatch)(initUser());
  await (store.dispatch as AppThunkDispatch)(initApp());

  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider theme={theme}>
            <Normalize />
            <GlobalStyles />
            <Routes />
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </React.StrictMode>,
    document.getElementById('root')
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();

run();
