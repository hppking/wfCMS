module.exports = function (fastify, opts, done) {
    const utils = require("../../utils")(fastify)

    //角色列表
    fastify.route({
        method: 'GET',
        url: '/manage/role',
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
            //console.log(request.query)
            //await fastify.stan.publish('system_log', "kk-----kkyvvvv")
            let where = r.row('id').gt(1)
            if (wk) {
                where = where.and(r.row('name').match(wk))
            }
            const items = await r.table('role').filter(where).orderBy(r.desc('id')).skip((p - 1) * pNum).limit(pNum).run()
            reply.send({ code: 0, items, total: await r.table('role').filter(where).count().run() })
        }
    })

    //创建成员
    fastify.route({
        method: 'POST',
        url: '/manage/role',
        preValidation: [utils.jwtAuth()],
        schema: {
            body: {
                type: 'object',
                required: ['name'],
                properties: {
                    name: {
                        type: 'string',
                        minLength: 2,
                        errorMessage: '请输入类型名称'
                    }
                }
            }
        },
        handler: async (request, reply) => {
            const post = request.body
            const r = fastify.db
            const ok = await r.table('role').filter({ name: post.name }).run()
            if (ok.length > 0) {
                throw utils.error('成员类型名称已存在请更换', 10004)
            }
            const id = await fastify.lastId()
            await r.table('role').insert({ id, name: post.name, add_time: utils.now(), status: 1, permission: [] }).run()
            reply.send({ code: 0, msg: '添加成功', id: id })
        }
    })

    //详情
    fastify.route({
        method: 'GET',
        url: '/manage/role/:id',
        preValidation: [utils.jwtAuth()],
        schema: {
            params: {
                type: 'object',
                required: ['id'],
                properties: {
                    id: {
                        type: 'integer',
                        minimum: 2
                    }
                }
            }
        },
        handler: async (request, reply) => {
            const { id } = request.params
            const r = fastify.db
            const item = await r.table('role').get(id).run()
            reply.send({ code: 0, msg: '成功', item })
        }
    })

    //更新成员
    fastify.route({
        method: 'PUT',
        url: '/manage/role/:id',
        preValidation: [utils.jwtAuth()],
        schema: {
            params: {
                type: 'object',
                required: ['id'],
                properties: {
                    id: {
                        type: 'integer',
                        minimum: 2
                    }
                }
            },
            body: {
                type: 'object',
                required: ['name'],
                properties: {
                    name: {
                        type: 'string',
                        minLength: 2,
                        errorMessage: '请输入类型名称'
                    }
                },
                additionalProperties: false,
            }
        },
        handler: async (request, reply) => {
            const { id } = request.params
            const r = fastify.db
            const ok = await r.table('role').get(id).run()
            if (!(ok.id > 0)) {
                throw utils.error('目标数据不存在,可能被删除', 10004)
            }
            await r.table('role').get(id).update(request.body).run()
            reply.send({ code: 0, msg: '更新成功' })
        }
    })

    //删除成员
    fastify.route({
        method: 'DELETE',
        url: '/manage/role/:id',
        preValidation: [utils.jwtAuth()],
        schema: {
            params: {
                type: 'object',
                required: ['id'],
                properties: {
                    id: {
                        type: 'integer',
                        minimum: 2
                    }
                }
            }
        },
        handler: async (request, reply) => {
            const { id } = request.params
            const r = fastify.db
            const ok = r.table('role').get(id).run()
            if (ok.length == 0) {
                throw utils.error('目标数据不存在,可能已被删除', 10004)
            }
            await r.table('role').get(id).delete().run()
            reply.send({ code: 0, msg: '删除成功' })
        }
    })

    done()
}