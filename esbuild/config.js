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

const paths = {
  outfile: path.join(__dirname, '../public/bundle.js'),
  inject: path.join(__dirname, './shims.js'),
  entryPoints: [path.join(__dirname, '../src/index.tsx')],
};

exports.commonConfig = {
  entryPoints: paths.entryPoints,
  bundle: true,
  plugins,
  define: {
    global: 'window',
  },
  inject: [paths.inject],
  outfile: paths.outfile,
};
