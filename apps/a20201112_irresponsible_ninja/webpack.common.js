const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
                    limit: 1
                }
            }
        ],
    },
    plugins: [new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'index.html')
    })]
};