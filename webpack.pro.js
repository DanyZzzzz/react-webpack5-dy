const path = require('path');
const { merge } = require('webpack-merge');
const webpackConfig = require('./webpack.common.js');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const srcDir = path.resolve(__dirname, './src');
// css/css module 正则表达式
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
// sass/sass module 正则表达式
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;
module.exports = env => {
    return merge(webpackConfig(env), {
        mode: 'production',
        entry: {
            index: './src/index.js',
        },
        devtool: 'hidden-source-map', // 报错的时候在控制台输出哪一行报错

        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    parallel: require('os').cpus().length - 1,
                    terserOptions: {
                        compress: {
                            warnings: false, // 删除无用代码时是否给出警告
                            drop_debugger: true, // 删除所有的debugger
                            drop_console: true, // 删除所有的console.*
                            pure_funcs: ['console.log'], // 删除所有的console.log
                        },
                    },
                }),
                new CssMinimizerPlugin(),
            ],
            //作用提升，开启后构建的代码会按照引入的顺序放到一个函数作用域种，通过适当的重命名防止变量名称相冲，减少函数声明及内存开销，通常只要mode为生产环境也够
            concatenateModules: true,
            splitChunks: {
                chunks: 'all',
                name: false,
                minSize: 10000, //50字节 引入的文件大于50kb才进行分割
                // maxSize: 50000, //50kb，尝试将大于50kb的文件拆分成n个50kb的文件
                minChunks: 1, //模块至少使用次数
                maxAsyncRequests: 5, //同时加载的模块数量最多是5个，只分割出同时引入的前5个文件
                maxInitialRequests: 3, //首页加载的时候引入的文件最多3个
                automaticNameDelimiter: '~', //缓存组和生成文件名称之间的连接符
                cacheGroups: {
                    react: {
                        name: 'react',
                        test: module => {
                            return /react/.test(module.context);
                        },
                        chunks: 'all',
                        priority: 10,
                        enforce: true,
                    },

                    antd: {
                        name: 'antd',
                        test: module => {
                            return /ant/.test(module.context);
                        },
                        chunks: 'initial',
                        priority: 11,
                        enforce: true,
                    },

                    babel: {
                        name: 'babel',
                        test: module => {
                            return /@babel|core/.test(module.context);
                        },
                        chunks: 'initial',
                        priority: 11,
                        enforce: true,
                    },
                },
            },
        },
        module: {
            rules: [
                {
                    test: /\.(js|mjs|jsx|ts|tsx)$/,
                    exclude: [
                        {
                            and: [/node_modules[\\/]/], //排除node_modules文件夹下面的所有文件
                            not: [
                                // 但是不排除下面的文件，因为他们使用了IE11不支持的语法。
                                /debug[\\/]/,
                            ],
                        },
                    ],

                    use: ['thread-loader', { loader: 'babel-loader', options: { cacheDirectory: true } }],
                    include: srcDir,
                },
                {
                    test: cssRegex,
                    exclude: cssModuleRegex,
                    use: ['thread-loader', MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
                },
                {
                    test: cssModuleRegex,
                    use: [
                        'thread-loader',
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                modules: {
                                    getLocalIdent: getCSSModuleLocalIdent,
                                },
                            },
                        },
                        'postcss-loader',
                    ],
                },
                {
                    test: lessRegex,
                    exclude: lessModuleRegex,
                    use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader'],
                    sideEffects: true,
                },
                {
                    test: lessModuleRegex,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                modules: {
                                    getLocalIdent: getCSSModuleLocalIdent,
                                },
                            },
                        },
                        'postcss-loader',
                        'less-loader',
                    ],
                },
                {
                    test: sassRegex,
                    exclude: sassModuleRegex,
                    use: ['thread-loader', MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
                },
                {
                    test: sassModuleRegex,
                    use: [
                        'thread-loader',
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                modules: {
                                    getLocalIdent: getCSSModuleLocalIdent,
                                },
                            },
                        },
                        'postcss-loader',
                        'sass-loader',
                    ],
                },
                /*
                 *webpack内置图片解码器
                 */
                {
                    test: /\.(jpe?g|png|gif|svg|woff|woff2|eot|ttf|otf)$/i,
                    type: 'asset',
                },
            ],
        },
        cache: {
            type: 'filesystem',
            // 可选配置
            buildDependencies: {
                config: [__filename], // 当构建依赖的config文件（通过 require 依赖）内容发生变化时，缓存失效
            },
        },
        plugins: [
            new CleanWebpackPlugin(),
            new BundleAnalyzerPlugin({ analyzerPort: 9090 }),
            new AntdDayjsWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: 'css/[name].[chunkhash:8].css', // 生成的文件名
            }),
            new OptimizeCssPlugin(),
        ],
    });
};
