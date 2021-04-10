/* eslint-disable @typescript-eslint/no-var-requires */
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const WorkerPlugin = require('worker-plugin');
module.exports = {
  plugins: [
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => {
          webpackConfig.resolve.plugins.push(new TsconfigPathsPlugin({}));
          webpackConfig.plugins.push(new WorkerPlugin());
          return webpackConfig;
        },
      },
    },
  ],
};
