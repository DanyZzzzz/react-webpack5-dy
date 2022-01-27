/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires */
const { merge } = require('webpack-merge');
const webpackConfig = require('./webpack.common.js');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const webpackProConfig = {
    mode: 'production',
    entry: {
        index: './src/index.js'
    },
    devtool: false, // 报错的时候在控制台输出哪一行报错
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
                        pure_funcs: ['console.log'] // 删除所有的console.log
                    }
                }
            }),
            new CssMinimizerPlugin()
        ],
        //作用提升，开启后构建的代码会按照引入的顺序放到一个函数作用域种，通过适当的重命名防止变量名称相冲，减少函数声明及内存开销，通常只要mode为生产环境也够
        concatenateModules: true,
        splitChunks: {
            chunks: 'all'
        }
    },
    cache: {
        type: 'filesystem',
        // 可选配置
        buildDependencies: {
            config: [__filename] // 当构建依赖的config文件（通过 require 依赖）内容发生变化时，缓存失效
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new BundleAnalyzerPlugin({ analyzerPort: 9090 }),
        new AntdDayjsWebpackPlugin(),
        new OptimizeCssPlugin()
    ]
};
module.exports=merge(webpackConfig,webpackProConfig)
