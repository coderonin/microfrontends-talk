const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
	entry: {
		'componentsBundle': [
			'src/cmps/search.js',
			'src/cmps/home.js',
			'src/cmps/artist.js',
			'src/cmps/play-list.js',
			'src/cmps/player.js'
		]
	},
	output: {
		publicPath: '/src/dist/',
    filename: '[name].js',
    path: path.resolve(__dirname, 'src/dist')
	},
	module: {
		rules: [
			{ test: /\.js$/, exclude: path.resolve(__dirname, 'node_modules'), loader: 'babel-loader'},
		],
	},
	node: {
		fs: 'empty'
	},
	resolve: {
		modules: [
			__dirname,
			'node_modules',
		],
	},
	plugins: [
		new CleanWebpackPlugin([path.resolve(__dirname, 'src/dist/componentsBundle.js')])
	],
	devtool: 'source-map',
	externals: [
	],
};