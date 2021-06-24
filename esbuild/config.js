require('dotenv').config();
const path = require('path');

const resolve = {
  name: 'resolve',
  setup(build) {
    // Add custom resolve rules for packages that break building.
    // These packages have the browser field in package.json, but it doesn't actually support the browser environment.
    build.onResolve({ filter: /^nanoid$/ }, () => {
      return {
        path: path.join(__dirname, '../node_modules/nanoid/index.browser.js'),
      };
    });
    build.onResolve({ filter: /^cbor$/ }, () => {
      return {
        path: path.join(__dirname, '../node_modules/cbor-web/dist/cbor.js'),
      };
    });
    build.onResolve({ filter: /^stream$/ }, () => {
      return {
        path: path.join(
          __dirname,
          '../node_modules/stream-browserify/index.js'
        ),
      };
    });
  },
};
const plugins = [resolve];

exports.plugins = plugins;

const paths = {
  outdir: path.join(__dirname, '../public'),
  inject: path.join(__dirname, './shims.js'),
  entryPoints: {
    main: path.join(__dirname, '../src/index.tsx'),
  },
};

exports.commonConfig = {
  entryPoints: paths.entryPoints,
  bundle: true,
  plugins,
  define: {
    global: 'window',
    'process.env': JSON.stringify({
      PUBLIC_URL: process.env.PUBLIC_URL,
      GA_MEASUREMENT_ID: process.env.GA_MEASUREMENT_ID,
      INFURA_ID: process.env.INFURA_ID,
      NODE_ENV: process.env.NODE_ENV || 'development',
    }),
  },
  inject: [paths.inject],
  outdir: paths.outdir,
};
