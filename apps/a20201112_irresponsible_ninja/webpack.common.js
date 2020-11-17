const path = require('path');
// const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// const definePlugin = new webpack.DefinePlugin({
//     __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
//     WEBGL_RENDERER: true,
//     CANVAS_RENDERER: true
// });

module.exports = {
    entry: {
        app: path.resolve(__dirname, './src/game.ts')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[chunkhash].js'
    },
    resolve: {
        extensions: ['.ts', '.js', '.json'],
        alias: {
            '@': path.resolve(__dirname, './'),
            '@src': path.resolve(__dirname, 'src'),
            '@images': path.resolve(__dirname, 'src/images'),
            '@scenes': path.resolve(__dirname, 'src/scenes'),
            '@scripts': path.resolve(__dirname, 'src/scripts')
        }
    },
    module: {
        rules: [{
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: require.resolve('phaser'),
                loader: 'expose-loader',
                options: {
                    exposes: ['Phaser']
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                loader: 'url-loader',
                options: {
                    limit: 1,
                    name: '[name].[hash:7].[ext]'
                }
            }
        ],
    },
    plugins: [new HtmlWebpackPlugin({
        // definePlugin,
        template: path.resolve(__dirname, 'index.html')
    })]
};