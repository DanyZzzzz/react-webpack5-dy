/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackbar = require('webpackbar');
const srcDir = path.resolve(__dirname, './src');
const devMode = process.env.NODE_ENV === 'development';
const RouterPlugin = require('./routePlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const myStyleLoader = devMode
    ? {
          loader: 'style-loader', // 开发环境的时候使用 style-loader，支持样式文件热模块重载(HMR)
          options: {
              esModule: false
          }
      }
    : {
          loader: MiniCssExtractPlugin.loader,
          options: {
              publicPath: '../', // 让通过 css 引入的图片或字体等资源的路径能够正确写入
              esModule: false
          }
      };
module.exports = {
    // mode: 'development',
    entry: {
        index: './src/index.js'
    },
    target: ['web', 'es5'],
    output: {
        path: path.resolve(__dirname, 'build'), // 将文件打包到此目录下
        publicPath: '/', // '' or 绝对路径：'/',
        filename: 'js/[name].[chunkhash:8].js',
        chunkFilename: 'js/[name].[chunkhash:8].chunk.js'
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
                            /debug[\\/]/
                        ]
                    }
                ],

                use: ['thread-loader', { loader: 'babel-loader', options: { cacheDirectory: true } }],
                include: srcDir
            },
            {
                test: /\.css$/,
                use: [myStyleLoader, 'css-loader', 'postcss-loader']
            },

            {
                test: /\.scss$/,
                use: [
                    myStyleLoader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 3,
                            modules: {
                                mode: 'local',
                                // localIdentName: process.env.NODE_ENV === 'development' ? '[path][name]__[local]' : '[contenthash:base64]',
                                localIdentName: '[local]__[name]-[contenthash:base64:8]'
                            }
                        }
                    },
                    'postcss-loader',
                    'resolve-url-loader',
                    'sass-loader',
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            resources: path.resolve(__dirname, '../src/config/theme/default/global.scss')
                        }
                    }
                ]
            },
            {
                test: /\.less$/,
                use: [
                    myStyleLoader,
                    'css-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                javascriptEnabled: true
                            }
                        }
                    }
                ]
            },
            /*
             *webpack内置图片解码器
             */
            {
                test: /\.(jpe?g|png|gif|svg|woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.(woff|woff2|ttf|otf|eot)$/, // .otf: 记得配置 aws amplify 应用程序设置 重写和重定向的正则
                type: 'asset/resource',
                generator: {
                    filename: 'font/[contenthash].[ext]'
                }
            }
        ]
    },
    resolve: {
        alias: {
            '@': srcDir,
            '@style': `${srcDir}/assest/style`,
            '@pages': `${srcDir}/pages`,
            '@img': `${srcDir}/assest/img`
        },
        extensions: ['.js', '.jsx', '.less', '.css', '.tsx', '.ts'] //后缀名自动补全
    },
    plugins: [
        new webpackbar(),
        new RouterPlugin({
            pagePath: path.join(srcDir, 'pages'),
            output: path.join(srcDir, 'config')
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[chunkhash].min.css',
            chunkFilename: 'css/[id].[chunkhash].min.css'
        }),
        // 生成 index.html
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true, // 是否将js放在body的末尾
            minify: {
                collapseWhitespace: true,
                removeComments: true
            } // 压缩HTML
        })
    ]
};
