const path = require('path');

const webpack = require('webpack');
const { merge } = require('webpack-merge');
const webpackConfig = require('./webpack.common.js');

const srcDir = path.resolve(__dirname, './src');

module.exports = env => {
    return merge(webpackConfig(env), {
        mode: 'development',

        entry: ['./src/index.js', 'webpack-hot-middleware/client?reload=true&path=/__webpack_hmr'],
        devtool: 'eval-cheap-module-source-map', // 报错的时候在控制台输出哪一行报错
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
            type: 'memory',
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
