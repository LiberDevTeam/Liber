import 'github-markdown-css';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { Normalize } from 'styled-normalize';
import '~/lib/i18n';
import { Routes } from './routes';
import * as serviceWorker from './serviceWorker';
import { store } from './state/store';
import { GlobalStyles, theme } from './theme';

ReactModal.setAppElement('#root');

async function run() {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    // @refs https://github.com/mswjs/msw/pull/126
    // If app has no active worker, but registration is exists, it was hard reloaded.
    // So we need to reload application to enabled service worker.
    if (!navigator.serviceWorker.controller && registrations.length > 0) {
      // eslint-disable-next-line no-restricted-globals
      location.reload();
    }
  }

  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Normalize />
          <GlobalStyles />
          <Routes />
        </ThemeProvider>
      </Provider>
    </React.StrictMode>,
    document.getElementById('root')
  );
}

serviceWorker.register({});

run();
