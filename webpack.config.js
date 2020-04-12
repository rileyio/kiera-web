exports.module.rules.push({
  test: /\.less$/,
  use: ['vue-style-loader', 'css-loader', 'less-loader']
})
