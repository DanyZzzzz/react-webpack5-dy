const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const webpackbar = require('webpackbar');

const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;
// css/css module 正则表达式
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
// sass/sass module 正则表达式
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
const srcDir = path.resolve(__dirname, './src');
const devMode = process.env.NODE_ENV !== 'production';
const RouterPlugin = require('./routePlugin');

module.exports = env => {
    return {
        // mode: 'development',
        entry: {
            index: './src/index.js',
        },
        target: ['web', 'es5'],

        output: {
            path: path.resolve(__dirname, 'build'), // 将文件打包到此目录下
            filename: 'js/[name].[chunkhash:8].js',
            chunkFilename: 'js/[name].[chunkhash:8].chunk.js',
        },

        plugins: [
            new webpackbar(),
            new RouterPlugin({
                pagePath: path.join(srcDir, 'pages'),
                output: path.join(srcDir, 'config'),
            }),

            // 生成 index.html
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: 'index.html',
                inject: true, // 是否将js放在body的末尾
                minify: {
                    collapseWhitespace: true,
                    removeComments: true,
                }, // 压缩HTML
            }),
        ],
        module: {
            rules: [
                devMode
                    ? {
                          // 编译前通过eslint检查代码 (注释掉即可取消eslint检测)
                          test: /\.(js|mjs|jsx|ts|tsx)$/,
                          enforce: 'pre',
                          use: ['eslint-loader'],
                          include: srcDir,
                      }
                    : null,
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

                    use: [{ loader: 'babel-loader', options: { cacheDirectory: true } }],
                    include: srcDir,
                },
                {
                    test: cssRegex,
                    exclude: cssModuleRegex,
                    use: ['style-loader', 'css-loader', 'postcss-loader'],
                },
                {
                    test: cssModuleRegex,
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
                    ],
                },
                {
                    test: lessRegex,
                    exclude: lessModuleRegex,
                    use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
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
                    use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
                },
                {
                    test: sassModuleRegex,
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
                        'sass-loader',
                    ],
                },
                /*
                 *webpack内置图片解码器
                 */
                {
                    test: /\.(jpe?g|png|gif|svg|woff|woff2|eot|ttf|otf)$/i,
                    type: 'asset/resource',
                },
            ],
        },
        stats: 'errors-only',
        resolve: {
            alias: {
                '@': srcDir,
                '@style': `${srcDir}/assest/style`,
                '@pages': `${srcDir}/pages`,
                '@img': `${srcDir}/assest/img`,
            },
            extensions: ['.js', '.jsx', '.less', '.css', '.tsx', '.ts'], //后缀名自动补全
        },
    };
};
