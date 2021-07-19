const path = require('path');
const { plugins, watch } = require('./config.js');

require('esbuild')
  .build({
    entryPoints: {
      sw: path.join(__dirname, '../src/sw/index.ts'),
    },
    bundle: true,
    plugins,
    define: {
      global: 'self',
      window: 'self',
    },
    outdir: path.join(__dirname, '../public'),
    inject: [path.join(__dirname, './shims.js')],
    watch,
  })
  .catch(() => process.exit(1));
