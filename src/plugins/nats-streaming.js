'use strict'

const fp = require('fastify-plugin')
const STAN = require('node-nats-streaming')

function fastifyNatsStreaming(fastify, options, next) {
    const { clusterId, clientID, natsUrl } = options
    const stan = STAN.connect(clusterId, clientID, natsUrl)
    stan.on('connect', nc => {
        fastify.decorate('stan', stan).addHook('onClose', close)
        next()
    })

    stan.on('error', err => {
        next(err)
    })
}

function close(fastify, done) {
    fastify
        .stan
        .close()

    done()
}

module.exports = fp(fastifyNatsStreaming, {
    fastify: '>=1.0.0',
    name: 'fastify-nats-streaming'
})