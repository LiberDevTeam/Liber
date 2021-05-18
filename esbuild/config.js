require('dotenv').config();
const path = require('path');

const resolve = {
  name: 'resolve',
  setup(build) {
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
    APP_PUBLIC_URL: JSON.stringify(process.env.PUBLIC_URL),
    'process.env.NODE_ENV': JSON.stringify(
      process.env.NODE_ENV || 'development'
    ),
  },
  inject: [paths.inject],
  outdir: paths.outdir,
};
