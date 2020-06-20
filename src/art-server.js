const fastify = require('fastify')()
const path = require('path')
if (process.env.NODE_ENV !== 'development') {
    fastify.register(require('fastify-static'), {
        root: path.resolve(__dirname, '../../public'),
        prefix: '/assets'
    })
}

//加载第一个页面
fastify.register(require('./pages/topic/index.ssr'))

fastify.get('/page2', (request, reply) => {
    const render = require('./pages/index2.art')
    reply.type('text/html; charset=utf-8').send(render({ hello: '第二个页面搞定' }))
})

fastify.get('/page3', (request, reply) => {
    const render = require('./pages/index3.art')
    reply.type('text/html; charset=utf-8').send(render({ hello: 'o' }))
})

if (process.env.NODE_ENV === 'development') {
    module.exports = (url) => {
        return new Promise((resolve, reject) => {
            fastify.inject({
                url: url
            }, (error, response) => {
                resolve(response.body)
            })
        })
    }
} else {
    fastify.listen(3000)
}