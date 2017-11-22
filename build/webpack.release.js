/* 生产环境配置 */ 
const webpack = require('webpack');
const { join, resolve } = require('path');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
// 创建多个实例
const extractCSS = new ExtractTextPlugin('css/[name].[chunkhash:8].css');
const extractLESS = new ExtractTextPlugin('css/[name]-[chunkhash:8].css');

// 导入路径
const {ROOT_PATH, SRC_PATH, DIST_PATH} = require('./pathResolve');

const config = {
    // 上下文：基础目录，绝对路径，入口起点(entry point)和 loader会相对于此目录查找，默认值为当前目录
    context: SRC_PATH,
    // 配置需要打包的入口文件，值可以是字符串、数组、对象。
    // 1. 字符串： entry： './entry'
    // 2. 字符串： entry：[ './entry1','entry2'] (多入口)
    // 3. 对象：   entry： {alert/index': path.resolve(pagesDir, `./alert/index/page`)}
    // 多入口书写的形式应为object，因为object的key在webpack里相当于此入口的name,
    entry: {
        app: "./pages/app.js",
        lib: ['react','react-dom']
    },
    output: {
        // path: 表示生成文件的根目录，绝对路径，path仅仅告诉Webpack结果存储在哪里
        path: DIST_PATH,
        // publicPath: "./",
        // 打包生成的文件名，[name] 指代入口文件的name，也就是上面提到的entry参数的key
        // [chunkhash:8]指生成一个8位的hash值，[hash]针对整个项目，[chunkhash]针对单个文件，便于浏览器高效缓存
        // chunkhash 不能与 --hot 同时使用
        // see https://github.com/webpack/webpack-dev-server/issues/377
        filename: "js/[name].[chunkhash:8].js",
        // 非入口(non-entry) chunk 文件的名称,一般使用CommonsChunkPlugin抽取公共模块
        chunkFilename: "js/async-[id].js"
    },
    // resolve(解析)，设置模块如何被解析
    resolve: {
        extensions: ['.js', '.json', '.jsx'],
        // 创建 import 或 require 的别名，来确保模块引入变得更简单
        alias: {
            components: resolve(SRC_PATH, './components'),
            conf: resolve(SRC_PATH, './conf'),
            static: resolve(ROOT_PATH, './static'),
            pages: resolve(SRC_PATH, './pages'),
            css: resolve(SRC_PATH, './css'),
            lib: resolve(SRC_PATH, './lib'),
        },
        // 解析模块时的搜索目录
        modules: ['node_modules', resolve(SRC_PATH, './lib')]
    },

    module:{
        rules: [
            // 代码规范检查，首先使用
            { 
                test: /\.(js|jsx)$/, // Rule.resource.test 的简写,资源匹配规则
                include: SRC_PATH,   // 检查源码路径下的文件
                enforce: 'pre',      // 前置loader，优先使用
                use: [
                {
                    options: {
                        formatter: eslintFormatter,
                        eslintPath: require.resolve('eslint'),
                    },
                    loader: require.resolve('eslint-loader'),
                }],
            },
            {
                // 规则数组，当规则匹配时，只使用第一个规则
                oneOf: [
                    // 使用babel处理js/jsx
                    {
                        test: /\.(js|jsx)$/,
                        include: SRC_PATH,
                        loader: require.resolve('babel-loader'), // require.resolve() 函数查询模块的完整路径
                        options: {
                            // 使用默认的目录'node_modules/.cache/babel-loader'缓存loader的执行结果，之后构建将先读取缓存
                            // 避免每次执行babel重编译带来的性能消耗
                            cacheDirectory: true,
                        },
                    },
                    // url-loader 功能类似于 file-loader，但是在文件大小（单位 byte）低于指定的限制时，可以返回一个 DataURL。
                    // css图片url会有问题：https://segmentfault.com/q/1010000008022834
                    {
                        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                        loader: require.resolve('url-loader'),
                        options: {
                            limit: 1000,
                            // 图片打包到项目产出路径dist下的images文件夹里
                            name:'images/[name].[hash:8].[ext]'
                        },
                    },
                    // postcss-loader 给某些样式加上浏览器前缀；css-loader 解析@import 和 url()，合并css文件，style-loader把样式内联到html中 
                    {
                        test: /\.css$/,
                        use: extractCSS.extract({
                                fallback:require.resolve('style-loader'),
                                use: [
                                    {
                                        loader: require.resolve('css-loader'),
                                        // 解决css图片url问题
                                        options: {
                                            url: false
                                        }
                                    },
                                    {
                                        loader: require.resolve('postcss-loader'),
                                        options: {           // 如果没有options这个选项将会报错 No PostCSS Config found
                                            plugins: (loader) => [
                                                require('autoprefixer')(), //CSS浏览器兼容
                                            ]
                                        }
                                    },
                                ]                               
                            })                                               
                    },
                    {
                        test: /\.less$/,
                        use: extractLESS.extract({
                                fallback:require.resolve('style-loader'),
                                use: [
                                    {
                                        loader: require.resolve('css-loader'),
                                    },
                                    {
                                        loader: require.resolve('postcss-loader'),
                                        options: {           // 如果没有options这个选项将会报错 No PostCSS Config found
                                            plugins: (loader) => [
                                                require('autoprefixer')(), //CSS浏览器兼容
                                            ]
                                        }
                                    },
                                    {
                                        loader: require.resolve('less-loader'),
                                    },
                                ]                              
                            })                                           
                    }    
                ]   
            }          
        ]
    },
    plugins: [
        // DefinePlugin 允许创建一个在编译时可以配置的全局常量。这可能会对开发模式和发布模式的构建允许不同的行为非常有用。
        new webpack.DefinePlugin({
            // http://stackoverflow.com/questions/30030031/passing-environment-dependent-variables-in-webpack
            // "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || 'development')
            'process.env': {NODE_ENV: '"production"'}
        }),
        // 每次编译生产环境代码时先将之前生成的文件删除掉
        new cleanWebpackPlugin(
            [
                'dist/css/*.css',
                'dist/js/*.js',
                'dist/images'
            ], 
            {
                root: ROOT_PATH
        }),
        extractCSS,
        extractLESS,
        new webpack.optimize.CommonsChunkPlugin({
            // 需要将运行环境提取到一个单独的manifest文件里,这样lib的hash就不会变了，就可以将lib缓存
            // http://cnodejs.org/topic/58396960c71e606e36aed1db
            names: ['lib', 'manifest']
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            inject: true,    // 将js插入到body底部
            template: resolve(ROOT_PATH, './static/htmlTpl.tpl'),
            favicon: resolve(ROOT_PATH, './static/images/favicon.ico'),
            // 压缩
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
            chunks: ['app','lib','manifest']
        }),
        // 压缩js、css，去掉不必要的模块
        //new UglifyJSPlugin()
        new UglifyJSPlugin({
            // todo：加上参数会报错？
            // 压缩选项
            // compress: {
            //     warnings: false,
            //     comparisons: false,
            // }
            // output: {
            //     comments: false,
            //     // ascii_only: true,
            // },
            sourceMap: false
        }),     
    ]
};

module.exports = config;