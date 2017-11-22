const webpack = require('webpack')
const releaseConfig = require('./webpack.release');

const compiler = webpack(releaseConfig);

compiler.run((err, stats) => {
  if (err) {
    throw new Error(err)
  }
  console.log(stats.toString({
    chunks: false,
    colors: true
  }))
})