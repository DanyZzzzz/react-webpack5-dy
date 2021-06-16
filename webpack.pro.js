const path = require('path');
const { merge } = require('webpack-merge');
const webpackConfig = require('./webpack.common.js');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = env => {
    return merge(webpackConfig(env), {
        mode: 'production',
        entry: {
            index: './src/index.js',
        },
        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    parallel: 4,
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

        plugins: [
            new CleanWebpackPlugin(),
            new BundleAnalyzerPlugin({ analyzerPort: 9090 }),
            // new AntdDayjsWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: 'dist/[name].[chunkhash:8].css', // 生成的文件名
            }),
            // 生成 index.html
        ],
    });
};
