import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'Delecta';
    font-style: normal;
    font-weight: normal;
    src: url(/fonts/ROBERT-CORSEANSCH-DELECTA.OTF);
  }


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
  primaryText: '#26404d',
  secondaryText: '#8fa7b2',
  lightText: '#fcfdfe',
  lightPrimary: '#75a7ff',
  darkPrimary: '#004ec2',
  disabled: '#dedede',
  bg: '#fcfdfe',
  bg2: '#f0f5fa',
  bg3: '#f3f3f3',
  bg4: '#c4c4c4',
  bgBlue: '#e5f7ff',
  bgGray: '#f5f8fa',
  modalBg: '#00000077',
  border: '#f0f5fa',
  green: '#4eeb91',
  yellow: '#e8eb5c',
  red: '#ef4141',
};

const fontSizes = {
  /**
   * 10px
   */
  xxs: '0.625rem',
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
  heading: `Delecta, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
  body: `Delecta, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
  mono: `SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace`,
};

const breakpoints = {
  xs: '360px',
  sm: '768px',
  md: '1024px',
  lg: '1920px',
  xl: '2560px',
};

export const theme = {
  colors,
  fontWeights,
  fontSizes,
  fontFamily,
  breakpoints,
  space: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64],
  sizes: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64],
  shadows: {
    0: 'none',
    1: 'rgba(0, 0, 0, 0.2) 0px 5px 20px',
  },
  radii: {
    medium: 12,
    large: 20,
    xl: 32,
    round: '50%',
  },
} as const;

type AppTheme = typeof theme;

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends AppTheme {}
}
