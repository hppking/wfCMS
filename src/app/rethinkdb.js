const fp = require("fastify-plugin")

module.exports = fp(function (fastify, opts, done) {
    const rdb = require('rethinkdbdash')({
        servers: [{ host: '127.0.0.1', port: 28015 }]
    })
    fastify.decorate('db', rdb)
    //生成 last id
    fastify.decorate('lastId', async () => {
        const r = await rdb.table("system").get("lastId").update({
            iid: rdb.row("iid").add(1)
        }, { returnChanges: true }).run()
        return r.changes[0]["new_val"].iid
    })
    done()
})