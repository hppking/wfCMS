module.exports = function (fastify, opts, done) {
    fastify.route({
        method: 'GET',
        url: '/',
        handler: function (request, reply) {
            const render = require('./index.art')

            reply.type('text/html; charset=utf-8').send(render({ hello: '嘿嘿', title: '话题详情' }))
        }
    })
    done()
}