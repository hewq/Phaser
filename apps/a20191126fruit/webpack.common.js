const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: {
		app: './src/js/index.js'
	},
	plugins: [
		new CleanWebpackPlugin({
			root: path.resolve(__dirname, './')
		}),
		new htmlWebpackPlugin({
			template: './src/index.html'
		}),
	    new webpack.DefinePlugin({
	      CANVAS_RENDERER: JSON.stringify(true),
	      WEBGL_RENDERER: JSON.stringify(true)
	    })
	],
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
			},
			{
				test: [/\.vert$/, /\.frag$/],
				use: "raw-loader"
			},
			{
				test: /\.(gif|png|jpe?g|svg|xml)$/i,
				use: "file-loader"
			}
		]
	},
	output: {
		filename: '[name].[chunkhash].js',
		path: path.resolve(__dirname, 'dist')
	},
	optimization: {
		runtimeChunk: 'single',
		moduleIds: 'hashed',
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					chunks: "all",
					name: "vendor"
				}
			}
		}
	}
}