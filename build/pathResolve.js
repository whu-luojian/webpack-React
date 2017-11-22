'use strict'

const path = require('path');

// 项目根路径
const ROOT_PATH = path.resolve(__dirname, '../');
// 项目源码路径
const SRC_PATH = path.resolve(ROOT_PATH, './src');
// 项目产出路径
const DIST_PATH = path.resolve(ROOT_PATH, './dist');
// 

module.exports = {
    ROOT_PATH,
    SRC_PATH,
    DIST_PATH
};
