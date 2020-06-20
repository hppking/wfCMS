module.exports = function (fastify, opts, done) {
    fastify.route({
        method: 'GET',
        url: '/vt',
        handler: function (request, reply) {
            reply.send({ text: 'hello fastify' })
        }
    })
    done()
}