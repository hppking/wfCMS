const crypto = require('crypto');

const md5 = (str) => {
    return crypto.createHash('md5').update(str).digest('hex');
}
function mfun(fastify) {
    const object = {
        md5,
        uuid: () => {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (placeholder) {
                var random = Math.floor(Math.random() * 16);
                var value = placeholder === 'x' ? random : random & 0x3 | 0x8;
                return value.toString(16);
            });
        },
        createPwd: (str) => {
            return md5('kyyyy----' + str);
        },
        now: () => {
            return new Date().toLocaleString()
        },
        error: (msg = '成功', code = 0) => {
            return new Error(JSON.stringify({ code, msg }));
        },
        jwtAuth: (force = true) => {
            return async (request, reply, done) => {
                const token = request.headers['x-token']
                try {
                    const deToken = fastify.jwt.decode(token)
                    if (!(deToken.id > 0)) {
                        throw { code: 10031, msg: '非法登录数据' }
                    }
                    request['user'] = deToken
                } catch (error) {
                    if (force) {
                        throw error
                    }
                    request['user'] = { id: 0 }
                }
            }
        },
        //OSS 签名直传
        ossSign: () => {

            const { ossAccessKeyId, host, secret, uploadDir, expire } = require('../config/oss')

            const end = new Date().getTime() + expire;

            const expiration = new Date(end).toISOString()
            //console.log(expiration, '------vvvvv')
            const policyString = {
                expiration,
                conditions: [
                    ['content-length-range', 0, 1048576000],
                    // [ 'starts-with', '$key', uploadDir ],
                ],
            }
            const policy = Buffer.from(new Buffer(JSON.stringify(policyString))).toString('base64');
            const signature = crypto.createHmac('sha1', secret).update(policy).digest('base64');
            const resp = {
                ossAccessKeyId,
                host,
                policy,
                signature,
                expire: Math.floor(end / 1000),
                directory: uploadDir,
            }
            return resp
        }
    }
    return object
}
module.exports = mfun