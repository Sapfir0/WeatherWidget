const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const root = path.resolve('.');

module.exports = (env) => {
    console.log(env);

    const currentEnivronment = env.NODE_ENV || env.nodeEnv; // почему-то devServer и обычная сборка по-разному прокидывают аргументы
    console.log(currentEnivronment);
    const isProduction = currentEnivronment === 'prod';

    const basePath = root + '/.env';

    const envPath = basePath + '.' + currentEnivronment;

    const finalPath = fs.existsSync(envPath) ? envPath : basePath;
    const fileEnv = dotenv.config({ path: finalPath }).parsed;

    const envKeys = fileEnv
        ? Object.keys(fileEnv).reduce((prev, next) => {
              prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
              return prev;
          }, {})
        : {};
    const devtool = isProduction ? false : 'eval-cheap-module-source-map'; // false или строка по шаблону
    console.log(envKeys);
    const serviceName = '/WeatherWidget/';
    return {
        entry: './src/index.tsx',
        output: {
            path: path.resolve(__dirname, 'build'),
            publicPath: isProduction ? serviceName : '/', // этот путь будет добавляться в пути до каждого бандла внутри html и других бандлов
            filename: 'js/[name].[fullhash].bundle.js',
            chunkFilename: 'js/[name].[fullhash].bundle.js',
        },
        devtool,
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    options: {
                        compilerOptions: {
                            sourceMap: !isProduction,
                        },
                    },
                },
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                modules: false,
                            },
                        },
                    ],
                },
                {
                    test: /\.(scss|module.(scss))$/,
                    exclude: /\.$/,
                    use: [
                        !isProduction ? 'style-loader' : MiniCssExtractPlugin.loader,
                        'css-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: !isProduction,
                            },
                        },
                    ],
                },
            ],
        },
        devServer: {
            contentBase: path.join(__dirname, 'public'),
            port: 3000,
            watchContentBase: true,
            progress: true,
            compress: true,
            hot: true,
            historyApiFallback: true,
        },
        plugins: [
            new CleanWebpackPlugin(),
            new webpack.ProvidePlugin({
                process: 'process/browser',
              }),
            new MiniCssExtractPlugin(),
            new webpack.DefinePlugin(envKeys),
            new HtmlWebpackPlugin({ template: './public/index.html', filename: 'index.html', inject: 'body' }),
        ],
    };
};
