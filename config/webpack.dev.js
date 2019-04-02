const path = require('path');
module.exports = {
  mode: 'development',
  entry: {
    client: './client/client.js',
  },
  output: {
    path: path.resolve(__dirname, '../public'),
    filename: "[name].js"
  },
  module: {
    rules: [
      { 
        test: /\.js$/, 
        exclude: /node_modules/, 
        loader: "babel-loader"
      },
      {
        test:/\.(s*)css$/,
        use:['style-loader','css-loader', 'sass-loader']
      }
    ]
 }
}