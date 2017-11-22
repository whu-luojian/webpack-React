const webpack = require('webpack');
const path = require('path');
//const merge = require('webpack-merge');
const webpackDevServer = require('webpack-dev-server');
// 启动时自动打开浏览器
const openBrowser = require('react-dev-utils/openBrowser');
const devConfig = require('./webpack.dev');

const PORT = 8090;
const HOST = 'localhost';
const localPublicPath = 'http://' + HOST + ':' + PORT + '/';
const localUrl = 'http://' + HOST + ':' + PORT;
// const devConfig = merge(basicConfig, {

// });

const compiler = webpack(devConfig);

const devServer = new webpackDevServer(compiler, {
    // 生成的js文件路径
    contentBase: path.resolve(__dirname, './dist/js'),
    disableHostCheck: true,
    hot: true,
    inline: true,
    open: true,
    // 用于准确控制输出哪些信息
    stats: {
        // 不同颜色表示不同信息
        colors: true,
        // 不增加内置模块信息
        modules: false,
        // 不增加子级信息
        children: false,
        // 不增加包信息，减少冗余输出
        chunks: false,
        // 不将内置模块信息增加到包信息
        chunkModules: false
    }
});

devServer.listen(PORT, HOST, ()=>{
    console.log('devServer listening at ' + localPublicPath);
    openBrowser(localUrl);
})

