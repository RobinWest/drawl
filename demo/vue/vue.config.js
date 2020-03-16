const path = require('path');

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@drawl': path.resolve(__dirname, '../../src'),
      },
    },
  },
};
