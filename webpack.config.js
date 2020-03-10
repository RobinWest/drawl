const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Drawl',
    libraryTarget: 'commonjs2',
  },
  mode: "production",
  plugins: [
    new CopyPlugin([
      { from: './package.json', to: './' },
      { from: './README.md', to: './' }
    ]),
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          },
        ]
      }
    ]
  }
};


