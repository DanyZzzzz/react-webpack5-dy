const path = require('path');

const webpack = require('webpack');
const { merge } = require('webpack-merge');
const webpackConfig = require('./webpack.common.js');

const srcDir = path.resolve(__dirname, './src');

module.exports = env => {
    return merge(webpackConfig(env), {
        mode: 'development',

        entry: ['./src/index.js', 'webpack-hot-middleware/client?reload=true&path=/__webpack_hmr'],
        devtool: 'eval-source-map', // 报错的时候在控制台输出哪一行报错
        output: {
            path: __dirname + '/', // 将打包好的文件放在此路径下，dev模式中，只会在内存中存在，不会真正的打包到此路径
            publicPath: '/', // 文件解析路径，index.html中引用的路径会被设置为相对于此路径
            filename: 'bundle-[contenthash].js', // 编译后的文件名字
        },

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
        },
        optimization: {
            moduleIds: 'deterministic',
        },
        cache: {
            type: 'filesystem',
            // 可选配置
            buildDependencies: {
                config: [__filename], // 当构建依赖的config文件（通过 require 依赖）内容发生变化时，缓存失效
            },
            name: 'development-cache', // 配置以name为隔离，创建不同的缓存文件，如生成PC或mobile不同的配置缓存
        },
        plugins: [new webpack.HotModuleReplacementPlugin()],
        resolve: {
            alias: {
                '@': srcDir,
                '@style': `${srcDir}/assest/style`,
                '@pages': `${srcDir}/pages`,
                '@img': `${srcDir}/assest/img`,
            },
            extensions: ['.js', '.jsx', '.less', '.css', '.tsx', 'ts'], //后缀名自动补全
        },
    });
};
