const { commonConfig } = require('./config');

const PORT = 3000;

require('esbuild')
  .serve({ servedir: 'public', port: PORT }, commonConfig)
  .then(() => {
    console.log(`Run server at http://localhost:${PORT}`);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
