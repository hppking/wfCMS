//
module.exports = function (fastify, opts, done) {
    const utils = require("../../utils")(fastify);
    //话题列表
    fastify.route({
        method: 'GET',
        url: '/manage/topic',
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
            const items = await r.table('topic').filter(where).orderBy(r.desc('id')).skip((p - 1) * pNum).limit(pNum).run()
            reply.send({ code: 0, items, total: await r.table('topic').filter(where).count().run() })
        }
    })

    //创建话题
    fastify.route({
        method: 'POST',
        url: '/manage/topic',
        preValidation: [utils.jwtAuth()],
        schema: {
            body: {
                type: 'object',
                required: ['title'],
                properties: {
                    title: {
                        type: 'string',
                        minLength: 2,
                        errorMessage: '请输入话题标题至少2字'
                    },
                    thumb: {
                        type: 'string',
                        errorMessage: '请选择封面图'
                    },
                    poster_img: {
                        type: 'string',
                    },
                    share_img: {
                        type: 'string',
                    },
                    content: {
                        type: 'string',
                    },
                    tags: {
                        type: 'array',
                        items: { type: 'string' },
                        uniqueItems: true,
                    },
                    attitudes: {
                        type: 'array',
                        maxItems: 2,
                        uniqueItems: true,
                        items: {
                            type: 'object',
                            properties: {
                                id: { type: 'integer', minimum: 1, maximum: 2 },
                                title: { type: 'string' },
                                icon: { type: 'string' }
                            }
                        },

                    },
                    interacts: {
                        type: 'array',
                        uniqueItems: true,
                        items: {
                            type: 'object',
                            properties: {
                                id: { type: 'integer', minimum: 1, maximum: 10 },
                                title: { type: 'string' },
                                icon: { type: 'string' }
                            }
                        },
                    }
                },
                additionalProperties: false,
            }
        },
        handler: async (request, reply) => {
            //fastify.utility()
            const post = request.body
            const r = fastify.db

            const ok = await r.table('topic').filter({ title: post.title }).run()
            if (ok.length > 0) {
                throw utils.error('话题标题已存在请更换', 10004)
            }
            const id = await fastify.lastId()
            post.id = id
            post.status = 1
            post.add_time = utils.now()
            //await r.table('topic').insert({ id, name: post.name, add_time: utils.now(), status: 1, permission: [] }).run()
            reply.send({ code: 0, msg: '添加成功', id: id, item: post })
        }
    })

    //更新话题
    fastify.route({
        method: 'PUT',
        url: '/manage/topic/:id',
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
        handler: async function (request, reply) {
            //fastify.utility()
            const db = fastify.db
            //db.table('tk').insert({ id: 2, ok: 'test' }).run()
            //
            const ro = await db.table('tk').get(2).run()
            const list = await db.table('tk').skip(0).limit(3).run()
            const g = await db.table('tk').group('ok').run()
            //console.log(ro)
            reply.send({ ky: 'hello home fastify ok', row: ro, list, g })
        }
    })

    //删除话题
    fastify.route({
        method: 'DELETE',
        url: '/manage/topic/:id',
        handler: async function (request, reply) {
            //fastify.utility()
            const db = fastify.db
            //db.table('tk').insert({ id: 2, ok: 'test' }).run()
            //
            const ro = await db.table('tk').get(2).run()
            const list = await db.table('tk').skip(0).limit(3).run()
            const g = await db.table('tk').group('ok').run()
            //console.log(ro)
            reply.send({ ky: 'hello home fastify ok', row: ro, list, g })
        }
    })

    //上下架话题
    fastify.route({
        method: 'DELETE',
        url: '/manage/topic/show/:id',
        handler: async function (request, reply) {
            //fastify.utility()
            const db = fastify.db
            //db.table('tk').insert({ id: 2, ok: 'test' }).run()
            //
            const ro = await db.table('tk').get(2).run()
            const list = await db.table('tk').skip(0).limit(3).run()
            const g = await db.table('tk').group('ok').run()
            //console.log(ro)
            reply.send({ ky: 'hello home fastify ok', row: ro, list, g })
        }
    })

    done()
}