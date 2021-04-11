const { commonConfig } = require('./config');

require('esbuild')
  .build(commonConfig)
  .catch(() => process.exit(1));
