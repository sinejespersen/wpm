var LiveReloadPlugin = require('webpack-livereload-plugin');
module.exports = {
  entry: {
    logic: './src/logic.js'
  },
  output: {
    path: __dirname,
    filename: './public/build/[name].js'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ['babel-loader']
      }
    ]
  },
  plugins: [new LiveReloadPlugin()]
};
