const path = require('path');
const { plugins } = require('./config.js');

require('esbuild')
  .build({
    entryPoints: {
      worker: path.join(__dirname, '../src/worker/index.ts'),
    },
    bundle: true,
    plugins,
    define: {
      global: 'self',
      window: 'self',
    },
    outdir: path.join(__dirname, '../public'),
    inject: [path.join(__dirname, './shims.js')],
    watch: {
      onRebuild(error, result) {
        if (error) {
          console.error('watch build failed:', error);
        } else {
          console.log('watch build succeeded:', result);
        }
      },
    },
  })
  .catch(() => process.exit(1));
