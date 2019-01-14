const path = require('path');

let config = {
  mode: 'development',
  entry: './index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'script.js'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  stats: 'minimal',
  devServer: {
    stats: 'minimal'
  }
};

module.exports = config;