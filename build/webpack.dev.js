/* 开发环境配置 */ 
const webpack = require('webpack');
const { join, resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');

// 导入路径
const {ROOT_PATH, SRC_PATH, DIST_PATH} = require('./pathResolve');



const config = {
    // 上下文：基础目录，绝对路径，入口起点(entry point)会相对于此目录查找，默认值为当前目录
    //context: SRC_PATH,
    devtool: 'eval-source-map',
    // 配置需要打包的入口文件，值可以是字符串、数组、对象。
    // 1. 字符串： entry： './entry'
    // 2. 字符串： entry：[ './entry1','entry2'] (多入口)
    // 3. 对象：   entry： {alert/index': path.resolve(pagesDir, `./alert/index/page`)}
    // 多入口书写的形式应为object，因为object的key在webpack里相当于此入口的name,
    entry: {
        app: resolve(SRC_PATH,"./pages/app.js"),
        //lib: ['react','react-dom']
    },
    output: {
        // path: 表示生成文件的根目录，绝对路径，path仅仅告诉Webpack结果存储在哪里
        path: DIST_PATH,
        // publicPath: "/",
        // 打包生成的文件名，[name] 指代入口文件的name，也就是上面提到的entry参数的key
        // [chunkhash:8]指生成一个8位的hash值，[hash]针对整个项目，[chunkhash]针对单个文件，便于浏览器高效缓存
        // chunkhash 不能与 --hot 同时使用
        // see https://github.com/webpack/webpack-dev-server/issues/377
        filename: "./js/bundle.js",
        // 非入口(non-entry) chunk 文件的名称,一般使用CommonsChunkPlugin抽取公共模块
        chunkFilename: "./js/async-[id].js"
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
        modules: ['node_modules', SRC_PATH]
    },

    module:{
        rules: [
            //代码规范检查，首先使用
            { 
                test: /\.(js|jsx)$/, // Rule.resource.test 的简写,资源匹配规则
                include: SRC_PATH,   // 检查源码路径下的文件
                enforce: 'pre',      // 前置loader，优先使用
                use: [
                {
                    options: {
                        //formatter: eslintFormatter,
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
                {
                    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                    loader: require.resolve('url-loader'),
                    options: {
                        limit: 10000,
                    },
                },
                // postcss-loader 给某些样式加上浏览器前缀；css-loader 解析@import 和 url()，合并css文件，style-loader把样式内联到html中 
                {
                    test: /\.css$/,
                    use: [
                        require.resolve('style-loader'),
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
                    ],
                },
                {
                    test: /\.less$/,
                    use: [
                        require.resolve('style-loader'),
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
                            options: {
                                modifyVars: { "@primary-color": "#1DA57A" },
                            },
                        },
                    ],
                },    
                ]    
            }
                  
        ]
    },
    plugins: [
        // DefinePlugin 允许创建一个在编译时可以配置的全局常量。这可能会对开发模式和发布模式的构建允许不同的行为非常有用。
        new webpack.DefinePlugin({
            // http://stackoverflow.com/questions/30030031/passing-environment-dependent-variables-in-webpack
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || 'development')
        }),
        new HtmlWebpackPlugin({
            inject: true,    // 将js插入到body底部
            template: resolve(ROOT_PATH, './static/htmlTpl.tpl'),
            favicon: resolve(ROOT_PATH, './static/images/favicon.ico'),
            chunks: ['app']
        }),
        // 模块热替换插件
        new webpack.HotModuleReplacementPlugin(),
        // 开启 HMR 的时候使用该插件会显示模块的相对路径，建议用于开发环境
        new webpack.NamedModulesPlugin(),        
    ],
};

module.exports = config;


