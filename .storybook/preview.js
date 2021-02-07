import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme, GlobalStyles } from '../src/theme';
import { Normalize } from 'styled-normalize';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};

const history = createBrowserHistory();

export const decorators = [
  (Story) => (
    <Router history={history}>
      <ThemeProvider theme={theme}>
        <Normalize />
        <GlobalStyles />
        <Story />
      </ThemeProvider>
    </Router>
  ),
];
