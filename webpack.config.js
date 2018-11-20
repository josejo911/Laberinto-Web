const config = {

	mode : 'production', devtool:'eval',
	output:{
		publicPath: '/dist'
	},
	module: {
		rules: [{
			test: /\.jsx?$/,
			use: ['babel-loader']
		},
		{
	        test: /\.css$/,
	        use: [ 'style-loader', 'css-loader' ]
		}, {
			test: /\.(png|jpg)$/,
			use: ['url-loader']
		}]
	}
}

module.exports = config
