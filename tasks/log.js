//操作日志消息处理 ++

const sc = require('node-nats-streaming').connect('test-cluster', 'knn_log', 'nats://nats-streaming:4222')

sc.on('connect', () => {
    const opts = sc.subscriptionOptions().setStartWithLastReceived()
    const subscription = sc.subscribe('system_log', opts)
    subscription.on('message', (msg) => {
        console.log('Received a message [' + msg.getSequence() + '] ' + msg.getData())
    })

})