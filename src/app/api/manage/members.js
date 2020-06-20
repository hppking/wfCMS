module.exports = function (fastify, opts, done) {
    const utils = require("../../utils")(fastify)

    //成员列表
    fastify.route({
        method: 'GET',
        url: '/manage/members',
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
                    uname: {
                        type: 'string',
                        default: ''
                    }
                }
            }
        },
        handler: async (request, reply) => {
            const r = fastify.db
            const { p, pNum, uname } = request.query
            //console.log(request.query)
            //await fastify.stan.publish('system_log', "kk-----kkyvvvv")
            let where = r.row('id').gt(1)
            if (uname) {

                where = where.and(r.row('uname').match(uname))
            }
            const items = await r.table('manage').filter(where).orderBy(r.desc('id')).skip((p - 1) * pNum).limit(pNum).run()
            reply.send({ code: 0, items, total: await r.table('manage').filter(where).count().run() })
        }
    })

    //创建成员
    fastify.route({
        method: 'POST',
        url: '/manage/members',
        preValidation: [utils.jwtAuth()],
        schema: {
            body: {
                type: 'object',
                required: ['uname', 'mobile', 'type'],
                properties: {
                    uname: {
                        type: 'string',
                        minLength: 2,
                        errorMessage: '请输入姓名'
                    },
                    mobile: {
                        type: 'string',
                        pattern: "^1[3456789][0-9]{9}$",
                        errorMessage: '请输入正确手机号码格式'
                    },
                    type: {
                        type: 'integer',
                        minimum: 1,
                        errorMessage: '请选择成员类型'
                    }
                }
            }
        },
        handler: async (request, reply) => {
            const post = request.body
            const r = fastify.db
            const ok = await r.table('manage').filter({ mobile: post.mobile, type: post.type }).run()
            if (ok.length > 0) {
                throw utils.error('成员的手机号已存在', 10004)
            }
            const id = await fastify.lastId()
            await r.table('manage').insert({ id, uname: post.uname, mobile: post.mobile, type: post.type, add_time: utils.now(), status: 1 }).run()
            reply.send({ code: 0, msg: '添加成功', id: id })
        }
    })

    //详情
    fastify.route({
        method: 'GET',
        url: '/manage/members/:id',
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
            const item = await r.table('manage').get(id).run()
            reply.send({ code: 0, msg: '删除成功', item })
        }
    })

    //更新成员
    fastify.route({
        method: 'PUT',
        url: '/manage/members/:id',
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
                required: ['uname', 'mobile', 'type'],
                properties: {
                    uname: {
                        type: 'string',
                        minLength: 2,
                        errorMessage: '请输入姓名'
                    },
                    mobile: {
                        type: 'string',
                        pattern: "^1[3456789][0-9]{9}$",
                        errorMessage: '请输入正确手机号码格式'
                    },
                    type: {
                        type: 'integer',
                        minimum: 1,
                        errorMessage: '请选择成员类型'
                    }
                },
                additionalProperties: false,
            }
        },
        handler: async (request, reply) => {
            const { id } = request.params
            const { mobile, type } = request.body
            const r = fastify.db
            const ok = await r.table('manage').get(id).run()
            if (!(ok.id > 0)) {
                throw utils.error('目标数据不存在,可能被删除', 10004)
            }
            //修改的手机号 与 原手机号不一样时候

            if (ok.mobile != mobile) {
                const nok = await r.table('manage').filter({ mobile, type }).run()
                if (nok.length > 0) {
                    throw utils.error('成员的手机号已存在', 10004)
                }
            }

            await r.table('manage').get(id).update(request.body).run()
            reply.send({ code: 0, msg: '更新成功' })
        }
    })

    //删除成员
    fastify.route({
        method: 'DELETE',
        url: '/manage/members/:id',
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
            await r.table('manage').get(id).delete().run()
            reply.send({ code: 0, msg: '删除成功' })
        }
    })

    done()
}