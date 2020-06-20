module.exports = function (fastify, opts, done) {
    const utils = require("../../utils")(fastify)
    const dayjs = require('dayjs')

    //登录
    fastify.route({
        method: 'POST',
        url: '/manage/login',
        schema: {
            body: {
                account: { type: 'string' },
                verify: { type: 'string' }
            }
        },
        handler: async (request, reply) => {
            const post = request.body
            //adminMG
            const r = fastify.db
            const admin = await r.table('manage').filter({ account: post.account }).limit(1).run()
            const adminU = admin.length == 1 ? admin[0] : { id: 0 }

            if (adminU.id === 0) {
                throw utils.error('账号或手机号未找到', 10021)
            }

            //输入错误10次 禁止登录
            if (adminU.login_error > 9) {
                throw utils.error('你的密码输入错误10次,不能再登录', 10021)
            }

            if (adminU.pwd != utils.createPwd(post.verify)) {
                //记录登录错误次数
                await r.table('manage').get(adminU.id).update({ login_error: r.row("login_error").add(1).default(1) }).run()
                throw utils.error('账号密码不正确', 10022)
            }
            //登录成功后 更新 一些数据
            r.table('manage').get(adminU.id).update({ login_error: 1 }).run()
            const token = fastify.jwt.sign({ id: adminU.id })
            reply.send({ code: 0, msg: '登录成功', payload: { token: token } })
        }
    })

    //发验证码
    fastify.route({
        method: 'POST',
        url: '/manage/sms/code',
        schema: {
            body: {
                mobile: { type: 'string' },
            }
        },
        handler: async (request, reply) => {
            const r = fastify.db
            const mobile = request.body.mobile
            //不是手机号
            if (!/^1[3456789]\d{9}$/.test(mobile)) {
                throw utils.error('手机号不正确', 10001)
            }
            const smss = await r.table('sms').filter({ mobile: mobile }).orderBy(r.desc('add_time')).limit(1).run()
            const sms = smss.length == 1 ? smss[0] : { add_time: 0 }
            //到期时间
            const exp_time = dayjs(sms.add_time).unix() + (60 * 3)
            if (exp_time > dayjs().unix()) {
                const s = exp_time - dayjs().unix()
                throw utils.error(`请${s}s后获取短信`, 10002)
            }
            const id = await fastify.lastId()
            const code = Math.ceil(Math.random() * 100000)
            await r.table('sms').insert({ id: id, mobile: mobile, code: code, add_time: utils.now(), ip: request.ip }).run()

            reply.send({ code: 0, msg: '发送成功' })
        }
    })

    //修改密码|找回密码
    fastify.route({
        method: 'POST',
        url: '/manage/password',
        handler: function (request, reply) {
            const cnf = {

            };
            reply.send(cnf)
        }
    })

    //富文本配置
    fastify.route({
        method: 'GET',
        url: '/manage/cnf/ueditor',
        //preValidation: [utils.jwtAuth()],
        handler: function (request, reply) {
            const { host } = require('../../config/oss')
            const cnf = {
                imageActionName: 'uploadimage',
                imageFieldName: 'file',
                imageMaxSize: 2048000,
                imageAllowFiles: ['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
                imageCompressEnable: false,
                imageCompressBorder: 1600,
                imageInsertAlign: 'none',
                imageUrl: host,
                //imageUrlPrefix: host,
                imagePathFormat: '/storage/image/{yyyy}{mm}{dd}/{time}{rand:6}',
                scrawlActionName: 'uploadscrawl',
                scrawlFieldName: 'upfile',
                scrawlPathFormat: '/storage/image/{yyyy}{mm}{dd}/{time}{rand:6}',
                scrawlMaxSize: 2048000,
                scrawlUrlPrefix: 'http://35.201.165.105:8000',
                scrawlInsertAlign: 'none',
                snapscreenActionName: 'uploadimage',
                snapscreenPathFormat: '/storage/image/{yyyy}{mm}{dd}/{time}{rand:6}',
                snapscreenUrlPrefix: 'http://35.201.165.105:8000',
                snapscreenInsertAlign: 'none',
                catcherLocalDomain: ['127.0.0.1', 'localhost', 'img.baidu.com', 'image.cdjtmm.com'],
                catcherActionName: '/api/manage/catch-remote-image',
                catcherFieldName: 'source',
                catcherPathFormat: '/storage/image/{yyyy}{mm}{dd}/{time}{rand:6}',
                catcherUrlPrefix: '',
                catcherMaxSize: 2048000,
                catcherAllowFiles: ['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
                videoActionName: 'uploadvideo',
                videoFieldName: 'upfile',
                videoPathFormat: '/storage/video/{yyyy}{mm}{dd}/{time}{rand:6}',
                videoUrlPrefix: 'http://35.201.165.105:8000',
                videoMaxSize: 102400000,
                videoAllowFiles: ['.flv', '.swf', '.mkv', '.avi', '.rm', '.rmvb', '.mpeg', '.mpg', '.ogg', '.ogv', '.mov', '.wmv', '.mp4', '.webm', '.mp3', '.wav', '.mid'],
                fileActionName: 'uploadfile',
                fileFieldName: 'upfile',
                filePathFormat: '/storage/file/{yyyy}{mm}{dd}/{time}{rand:6}',
                fileUrlPrefix: 'http:\/\/35.201.165.105:8000',
                fileMaxSize: 51200000,
                fileAllowFiles: ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.flv', '.swf', '.mkv', '.avi', '.rm', '.rmvb', '.mpeg', '.mpg', '.ogg', '.ogv', '.mov', '.wmv', '.mp4', '.webm', '.mp3', '.wav', '.mid', '.rar', '.zip', '.tar', '.gz', '.7z', '.bz2', '.cab', '.iso', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.pdf', '.txt', '.md', '.xml'],
                imageManagerActionName: 'listimage',
                imageManagerListPath: '/storage/image/',
                imageManagerListSize: 20,
                imageManagerUrlPrefix: 'http://35.201.165.105:8000',
                imageManagerInsertAlign: 'none',
                imageManagerAllowFiles: ['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
                fileManagerActionName: 'listfile',
                fileManagerListPath: '/storage/file/',
                fileManagerUrlPrefix: 'http://35.201.165.105:8000',
                fileManagerListSize: 20,
                fileManagerAllowFiles: ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.flv', '.swf', '.mkv', '.avi', '.rm', '.rmvb', '.mpeg', '.mpg', '.ogg', '.ogv', '.mov', '.wmv', '.mp4', '.webm', '.mp3', '.wav', '.mid', '.rar', '.zip', '.tar', '.gz', '.7z', '.bz2', '.cab', '.iso', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.pdf', '.txt', '.md', '.xml'],
            };
            reply.send({ code: 0, data: cnf })
        }
    })

    //百度富文本 别人家的图片转成OSS 图片
    fastify.route({
        method: 'GET',
        url: '/manage/catch-remote-image',
        //preValidation: [utils.jwtAuth()],
        handler: async (request, reply) => {
            const { ossAccessKeyId, host, secret } = require('../../config/oss')
            const OSS = require('ali-oss')
            const Duplex = require('stream').Duplex;
            function bufferToStream(buffer) {
                const stream = new Duplex();
                stream.push(buffer);
                stream.push(null);
                return stream;
            }
            const client = new OSS({
                region: 'oss-cn-shenzhen',
                accessKeyId: ossAccessKeyId,
                accessKeySecret: secret,
                bucket: 'youdianzishi',
            });

            const form = request.body;
            const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36';
            let newImages = [];
            for (let i in form.source) {
                const imgurl = form.source[i];
                const remoteUrlKey = `CRK:${utils.md5(imgurl)}`;
                const rurl = await fastify.redis.get(remoteUrlKey);
                if (rurl) {
                    newImages.push({
                        state: 'SUCCESS',
                        source: imgurl,
                        url: rurl,
                    });
                    continue;
                }
                // 微信图片要特别处理
                const url = imgurl.indexOf('qpic.cn') > -1 ? imgurl.split('?')[0] : imgurl;
                const resp = await ctx.curl(url, { method: 'GET', userAgent: ua });
                if (resp.status === 200) {
                    const stream = bufferToStream(resp.data);
                    const fn = `c/ueditor/${utils.uuid()}`;
                    const result = await client.putStream(fn, stream);
                    if (result.res.status === 200) {
                        newImages.push({
                            state: 'SUCCESS',
                            source: imgurl,
                            url: `${host}/${fn}`,
                        });
                        await fastify.redis.set(remoteUrlKey, `${host}/${fn}`);
                    }
                }
            }
            reply.send({ code: 0, data: newImages, msg: '成功' })
        }
    })

    //OSS远程配置
    fastify.route({
        method: 'GET',
        url: '/manage/osscnf',
        preValidation: [utils.jwtAuth()],
        handler: async (request, reply) => {

            reply.send({ code: 0, item: utils.ossSign(), msg: '成功' })
        }
    })
    done()
}