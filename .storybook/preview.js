import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme, GlobalStyles } from '../src/theme';
import { Normalize } from 'styled-normalize';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};

export const decorators = [
  (Story) => (
    <ThemeProvider theme={theme}>
      <Normalize />
      <GlobalStyles />
      <Story />
    </ThemeProvider>
  ),
];
