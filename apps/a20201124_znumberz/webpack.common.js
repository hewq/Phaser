const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: {
            import: './src/game.ts',
            dependOn: 'vendor'
        },
        'vendor': 'phaser'
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
            '@scripts': path.resolve(__dirname, 'src/scripts'),
            '@data': path.resolve(__dirname, 'src/data')
        }
    },
    module: {
        rules: [{
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
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
        template: path.resolve(__dirname, 'index.html')
    })]
};