const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: glob.sync('./test/**/*.spec.ts'),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
		fallback: {
			fs: false
		},
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'tests.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Mocha Tests',
      template: 'test/index.html',
    }),
  ]
};
