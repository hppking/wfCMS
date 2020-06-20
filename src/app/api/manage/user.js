module.exports = function (fastify, opts, done) {
    const utils = require("../../utils")(fastify)

    //用户列表
    fastify.route({
        method: 'GET',
        url: '/manage/users',
        preValidation: [utils.jwtAuth()],
        schema: {
            querystring: {
                type: 'object',
                required: [],
                additionalProperties: false,
                properties: {
                    p: {
                        type: 'integer',
                        default: 1
                    },
                    pNum: { type: 'integer', default: 10 },
                    wk: {
                        type: 'string',
                        default: ''
                    }
                }
            }
        },
        handler: async (request, reply) => {
            const r = fastify.db
            const { p, pNum, wk } = request.query

            let where = r.row('id').gt(1)
            if (wk) {
                where = where.and(r.row('name').match(wk))
            }
            const items = await r.table('users').filter(where).orderBy(r.desc('id')).skip((p - 1) * pNum).limit(pNum).run()
            reply.send({ code: 0, items, total: await r.table('users').filter(where).count().run() })
        }
    })

    done()
}