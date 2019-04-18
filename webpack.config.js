const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
	entry: {
		'NavApplication': 'src/apps/nav-app/index.js',
		'PlaylistApplication': 'src/apps/music/playlist',
		'MusicPlayerApp': 'src/apps/music/player',
		'SearchApp': 'src/apps/search/index.js',
		'ArtistApp': 'src/apps/artist/index.js',
	},
	output: {
		publicPath: '/src/dist/',
    filename: '[name].js',
    library: "[name]",
    libraryTarget: "umd",
    path: path.resolve(__dirname, 'src/dist')
	},
	module: {
		rules: [
			{ test: /\.js$/, exclude: path.resolve(__dirname, 'node_modules'), loader: 'babel-loader' },
      { test: /\.less$/, loader: 'css-raw-loader!less-loader' }
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
		new CleanWebpackPlugin([path.resolve(__dirname, 'src/dist')])
	],
	devtool: 'source-map',
	externals: [
	],
};