const fastify = require('fastify')()
const HMR = require('fastify-webpack-hmr')
const path = require('path')
const webpack = require('webpack')
const webpackServerConfig = require('./webpack.server.config.js')
const webpackFedConfig = require('./webapck.fed.config.js')
//多编译器 webpackServerConfig 注意 只放在第一个位置
const devCompiler = webpack([webpackServerConfig, webpackFedConfig])
fastify.register(HMR, {
  compiler: devCompiler,
  webpackDev: {
    publicPath: '/',
    quiet: true,
    stats: {
      colors: true
    }
  }
})

fastify.get('/__dev*', (request, reply) => {
  let url = request.raw.url.replace('/__dev', '')
  url = url == '' ? '/' : url
  devCompiler.compilers[0].outputFileSystem.readFile(path.join(__dirname, './bin', 'art.server'), (err, result) => {
    const resp = eval(result.toString())
    resp(url).then(html => {
      reply.type('text/html; charset=utf-8').send(html)
    })
  })
  //reply.type('text/html; charset=utf-8').send("fok")
})
fastify.get('/', (request, reply) => {
  reply.redirect('/__dev/')
})
fastify.listen(3000)

