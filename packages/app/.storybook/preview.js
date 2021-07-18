import { createBrowserHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Normalize } from 'styled-normalize';
import { store } from '../src/state/store';
import { GlobalStyles, theme } from '../src/theme';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};

const history = createBrowserHistory();

export const decorators = [
  (Story) => (
    <Router history={history}>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Normalize />
          <GlobalStyles />
          <Story />
        </Provider>
      </ThemeProvider>
    </Router>
  ),
];
