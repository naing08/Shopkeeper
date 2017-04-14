var webpack = require('webpack');

module.exports = {
    entry: {
        admin: './client/browser.js',
        site:'./client/site/browser.js'
        //'webpack/hot/dev-server',
        //'webpack-dev-server/client?http://localhost:3132'
    },
    module: {
        loaders: [{
            test: /\.js?$/,
            exclude: /node_modules/,
            loaders: ["babel-loader"]
        }]
    },
    resolve: {
        extensions: ['', '.js']
    },
    output: {
        path: './public',
        filename: '[name].bundle.js'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        // new webpack.optimize.OccurenceOrderPlugin(),
        // new webpack.DefinePlugin({
        //     'process.env': {
        //         'NODE_ENV': JSON.stringify('production')
        //     }
        // }),
        // new webpack.optimize.UglifyJsPlugin({
        //     compressor: {
        //         warnings: false
        //     }
        // })
    ],
    devtool: 'source-map'
};

