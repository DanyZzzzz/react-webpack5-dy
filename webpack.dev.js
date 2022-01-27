/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const apiMocker = require('mocker-api');
const webpackConfig = require('./webpack.common.js');
const webpackDevConfig = {
    mode: 'development',
    entry: ['./src/index.js', 'webpack-hot-middleware/client?reload=true&path=/__webpack_hmr'],
    devtool: 'eval-cheap-module-source-map', // 报错的时候在控制台输出哪一行报错
    stats: 'errors-only',
    devServer: {
        // port: 5000,
        // host: 'localhost',
        hot: true,
        hotOnly: true,
        open: true,
        // overlay: {
        //     warnings: true,
        //     errors: true,
        // },
        // useLocalIp: true,
        proxy: {
            //              '/api': {
            //     target: 'https://other-server.example.com',
            //     secure: false,
            //   },
        },
        onBeforeSetupMiddleware(app) {
          // 新版的webpack-dev-server的app外面包裹了一层
          apiMocker(app.app, path.resolve(dirs.src, './.mocks/index.ts')); // mocker-api
        },
    },
    //长期缓存
    optimization: {
        moduleIds: 'deterministic'
    },
    cache: {
        type: 'memory'
    },
    plugins: [new webpack.HotModuleReplacementPlugin()]
};
module.exports=merge(webpackConfig,webpackDevConfig)
