import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html, body, #root {
    width: 100%;
    height: 100%;
  }

  #root {
    font-family: ${(props) => props.theme.fontFamily.body};
  }

  /* Remove default margin */
  body,
  h1,
  h2,
  h3,
  h4,
  p,
  figure,
  blockquote,
  dl,
  dd {
    margin: 0;
  }
`;

const colors = {
  primary: '#2e79f6',
  primaryText: '#1a2c58',
  secondaryText: '#a0aabe',
  lightText: '#fcfdfe',
  lightPrimary: '#75a7ff',
  darkPrimary: '#004ec2',
  bg: '#fcfdfe',
  bg2: '#f0f5fa',
  bg3: '#f3f3f3',
  border: '#f0f5fa',
  green: '#4eeb91',
  yellow: '#e8eb5c',
  red: '#ef4141',
};

const fontSizes = {
  /**
   * 12px
   */
  xs: '0.75rem',
  /**
   * 14px
   */
  sm: '0.875rem',
  /**
   * 16px
   */
  md: '1rem',
  /**
   * 18px
   */
  lg: '1.125rem',
  /**
   * 20px
   */
  xl: '1.25rem',
  /**
   * 24px
   */
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
  '5xl': '3rem',
  '6xl': '3.75rem',
  '7xl': '4.5rem',
  '8xl': '6rem',
  '9xl': '8rem',
};

const fontWeights = {
  thin: 100,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
};

const fontFamily = {
  heading: `"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
  body: `"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
  mono: `SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace`,
};

export const theme = {
  colors,
  fontWeights,
  fontSizes,
  fontFamily,
  space: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64],
  sizes: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64],
  shadows: {
    0: 'none',
    1: 'rgba(0, 0, 0, 0.2) 0px 5px 20px',
  },
  radii: {
    medium: 12,
    large: 20,
    round: '50%',
  },
} as const;

type AppTheme = typeof theme;

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends AppTheme {}
}