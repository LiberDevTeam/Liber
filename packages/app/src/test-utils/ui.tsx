import { configureStore } from '@reduxjs/toolkit';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { reducers } from '~/state/reducers';
import type { RootState } from '~/state/store';
import { i18n } from '~/test-utils/i18n';
import { theme } from '~/theme';

const customRender = (
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = configureStore({ reducer: reducers, preloadedState }),
    ...options
  }: Omit<RenderOptions, 'wrapper'> & {
    store?: any;
    preloadedState?: Partial<RootState>;
  } = {}
): RenderResult => {
  const Wrapper: React.FC = ({ children }) => (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </I18nextProvider>
    </Provider>
  );
  return render(ui, { wrapper: Wrapper, ...options });
};

export * from '@testing-library/react';
export { customRender as render };
