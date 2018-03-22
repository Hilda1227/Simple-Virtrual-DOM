const path = require('path');
module.exports = {
    // 打包的入口文件
    entry: [path.resolve(__dirname, './src/index.js')],
    // 打包后新生成的文件路径和名称
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'boundle.js'
    }
}