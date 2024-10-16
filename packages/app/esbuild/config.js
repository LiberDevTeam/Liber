require('dotenv').config();
const args = process.argv.slice(2);
const path = require('path');

const resolve = {
  name: 'resolve',
  setup(build) {
    // Add custom resolve rules for packages that break building.
    // These packages have the browser field in package.json, but it doesn't actually support the browser environment.
    build.onResolve({ filter: /^nanoid$/ }, () => {
      return {
        path: path.join(
          __dirname,
          '../../../node_modules/nanoid/index.browser.js'
        ),
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
          '../../../node_modules/stream-browserify/index.js'
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

const envValues = [
  'PUBLIC_URL',
  'GA_MEASUREMENT_ID',
  'INFURA_ENDPOINT',
  'INFURA_ID',
  'CHAIN_ID',
  'ENABLE_REMOTE_DEBUG',
  'FEEDS_DB_ADDRESS',
  'EXPLORE_PLACE_DB_ADDRESS',
  'EXPLORE_MESSAGE_DB_ADDRESS',
  'MARKETPLACE_STICKER_NEW_DB_ADDRESS',
  'MARKETPLACE_BOT_NEW_DB_ADDRESS',
  'MARKETPLACE_STICKER_RANKING_DB_ADDRESS',
  'MARKETPLACE_BOT_RANKING_DB_ADDRESS',
].reduce((prev, key) => {
  return { ...prev, [`process.env.${key}`]: JSON.stringify(process.env[key]) };
}, {});

exports.watch = args.includes('--watch')
  ? {
      onRebuild(error, result) {
        if (error) {
          console.error('watch build failed:', error);
        } else {
          console.log('watch build succeeded:', result);
        }
      },
    }
  : undefined;

exports.commonConfig = {
  absWorkingDir: process.cwd(),
  entryPoints: paths.entryPoints,
  bundle: true,
  plugins,
  define: {
    global: 'window',
    'process.env.NODE_ENV': JSON.stringify(
      process.env.NODE_ENV || 'development'
    ),
    ...envValues,
  },
  inject: [paths.inject],
  outdir: paths.outdir,
};
