module.exports = function (fastify, opts, done) {
    const utils = require("../../utils")(fastify)


    //初始化 数据表,超级管理员
    fastify.route({
        method: 'GET',
        url: '/manage/init',
        handler: async (request, reply) => {
            const db = fastify.db
            const tables = [
                'comments',
                'feedbacks',
                'logouts',
                'manage',
                'permissions',
                'role',
                'sms',
                'topic',
                'users',
                'system'
            ];
            const already_exists = await db.tableList().run()
            //创建新表
            for (const i in tables) {
                if (already_exists.indexOf(tables[i]) == -1) {
                    //await db.tableCreate(tables[i])
                }
            }
            //添加超级管理员
            //const rk = await db.table('manage').insert({ id: 1, account: 'adminMG', uname: '超级管理员', pwd: utils.createPwd('z123456!@#'), login_error: 0 }).run()
            //console.log(rk)
            //await db.table('system').insert({ id: 'lastId', iid: 100000000000 }).run()
            //id: await fastify.lastId()
            reply.send({ code: 0, msg: '完成初始化' })
        }
    })

    done()
}