const fastify = require('fastify')({
    logger: true
})

const Ajv = require('ajv')
const ajv = new Ajv({
    allErrors: true,
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: true,
    jsonPointers: true
})
const ajw_local_zh = require('ajv-i18n/localize/zh')
require('ajv-errors')(ajv)
fastify.schemaCompiler = function (schema) { return ajv.compile(schema) }

const glob = require("glob")
const path = require("path")
// Declare a route
fastify.get('/', async (request, reply) => {

    reply.view('./index', { hello: 'hello world' })
})

//加入art-template
fastify.register(require('point-of-view'), {
    engine: {
        'art-template': require('art-template')
    },
    templates: path.resolve(__dirname, 'pages'),
    options: {

    }

})

//注册路由文件
const routes = async () => {
    const fn = new Promise((resolve, reject) => {
        glob("app/api/**/*.js", {}, function (er, files) {
            resolve(files)
        })
    })
    const files = await fn
    for (let i in files) {
        fastify.register(require('./' + files[i]))
    }
}
//加载rethink db 
fastify.register(require('./app/rethinkdb'))
//注册数据逻辑层

//设置错误统一返回
fastify.setErrorHandler(function (error, request, reply) {
    let objMsg = {}
    if (error.validation) {
        ajw_local_zh(error.validation)
        objMsg = {
            code: 10002,
            msg: error.validation[0].message,
            //errors: error.validation
        }
    }
    else if (Object.prototype.toString.call(error) == '[object Error]') {
        try {
            objMsg = JSON.parse(error.message)
        } catch (err) {
            objMsg = {
                code: 10000,
                msg: error.message
            }
        }

    }

    reply.code(200).send(Object.assign({ code: 10001, msg: '服务器错误' }, objMsg))
})

//加入 jwt
fastify.register(require('fastify-jwt'), {
    secret: '===..123iiiii'
})

fastify.register(require('./plugins/nats-streaming'), {
    clusterId: 'test-cluster',
    clientID: 'knn00',
    natsUrl: 'nats://localhost:14222'
}, err => {
    if (err) throw err
})

// Run the server!
const start = async () => {

    await routes()
    try {
        await fastify.listen(3000)
        //fastify.log.info(`server listening on ${fastify.server.address().port}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()