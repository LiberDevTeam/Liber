import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html, body, #root {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: white;
  }

  * {
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

  a {
    text-decoration: none;
  }

  ul {
    list-style: none;
    padding: 0;
  }
`;

const colors = {
  lightText: '#fcfdfe',
  lightPrimary: '#75a7ff',
  darkPrimary: '#004ec2',
  disabled: '#dedede',
  bg: '#fcfdfe',
  bg2: '#f0f5fa',
  bg3: '#f3f3f3',
  bg4: '#c4c4c4',
  bgPrimary: '#f2f7ff',
  bgGreen: '#E5FFE8',
  bgBlue: '#e5f7ff',
  bgGray: '#f5f8fa',
  modalBg: '#00000077',
  border: '#f0f5fa',
  yellow: '#e8eb5c',

  // new design below
  primary: '#2e79f6',
  gray: '#e1e4e6',
  gray1: '#8FA7B3',
  gray2: '#edf1f2',
  gray3: '#F5F8FA',
  gray4: '#26404d',
  primaryText: '#26404d',
  secondaryText: '#8fa7b2',
  red: '#df2121',
  white: '#ffffff',
  green: '#1fbb2f',
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
  /**
   * xxs: 10px
   * xs: 12px
   * sm: 14px
   * md: 16px
   * lg: 18px
   * xl: 20px
   * 2xl: 24px
   */
  fontSizes,
  fontFamily,
  breakpoints,
  space: [...Array(25).keys()].map((n) => n * 4),
  sizes: [...Array(25).keys()].map((n) => n * 4),
  shadows: {
    0: 'none',
    1: 'rgba(0,0,0,0.2) 0 .2rem .5rem',
    2: 'rgba(143,167,178,0.2) 0 .2rem .5rem',
  },
  radii: {
    medium: 12,
    large: 20,
    xl: 32,
    round: '50%',
  },
  border: {
    white: {
      1: `1px solid ${colors.white}`,
      2: `2px solid ${colors.white}`,
    },
    gray: {
      1: `1px solid ${colors.gray}`,
    },
    gray1: {
      1: `1px solid ${colors.gray1}`,
      2: `2px solid ${colors.gray1}`,
    },
    gray2: {
      1: `1px solid ${colors.gray2}`,
      2: `2px solid ${colors.gray2}`,
    },
    gray3: {
      1: `1px solid ${colors.gray3}`,
      2: `2px solid ${colors.gray3}`,
    },
    gray4: {
      1: `1px solid ${colors.gray4}`,
      2: `2px solid ${colors.gray4}`,
    },
    primary: {
      1: `1px solid ${colors.primary}`,
      2: `2px solid ${colors.primary}`,
    },
  },
  linearGradient: {
    0: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 60%, #000000 125%)',
  },
} as const;

type AppTheme = typeof theme;

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends AppTheme {}
}
