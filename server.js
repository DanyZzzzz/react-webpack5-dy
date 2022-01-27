/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express'); // express服务器端框架
const webpack = require('webpack'); // webpack核心
const webpackDevMiddleware = require('webpack-dev-middleware'); // webpack服务器
const webpackHotMiddleware = require('webpack-hot-middleware'); // HMR热更新中间件
const webpackConfig = require('./webpack.dev.js'); // webpack开发环境的配置文件
const open = require('open');
// const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express(); // 实例化express服务
let PORT = 7777; // 服务启动端口号

const env = process.env.NODE_ENV; // 模式（dev开发环境，production生产环境）

if (env === 'production') {
    // 如果是生产环境，则运行build文件夹中的代码
    PORT = 8889;
    app.use(express.static('build'));
    app.listen(PORT, () => {
        console.log('本地服务开启了，启动地址: http://localhost:%s', PORT);
    });
    open(`http://localhost:${PORT}`);
} else {
    // const config = {
    //     target: 'http://www.asdas.com', //目标地址
    //     changeOrigin: true, //默认false，是否需要改变主机头为目标URL
    //     ws: true, //是否代理ws
    //     pathRewrite: {
    //         // '^/api/old-path' : '/api/new-path',
    //     }, //重写请求
    //     router: {
    //         // 重写目标服务器 'http://www.example.org' 为 'http://localhost:8000'
    //         // 'http://www.example.org' : 'http://localhost:8000'
    //     },
    // };

    // app.use('**', createProxyMiddleware({ target: 'http://abc:8080' }));

    const compiler = webpack(webpackConfig);
    app.use(express.static('dll'));

    app.use(
        webpackDevMiddleware(compiler, {
            publicPath: '/' // 对应webpack配置中的publicPath
            // hot: true,
            // inline: true,
            // noInfo: false,
            // stats: {
            //     colors: true,
            // },
        })
    );
    app.use(webpackHotMiddleware(compiler)); // 挂载HMR热更新中间件
    /** 启动服务 **/
    app.listen(PORT, () => {
        open(`http://localhost:${PORT}`);

        console.log('本地服务启动地址: http://localhost:%s', PORT);
    });
}
