//公共处理消息中心

const sc = require('node-nats-streaming').connect('test-cluster', 'knn_code', 'nats://nats-streaming:4222')

sc.on('connect', () => {
    const opts = sc.subscriptionOptions().setStartWithLastReceived()
    const subscription = sc.subscribe('system_code', opts)
    subscription.on('message', (msg) => {
        console.log('Received a message [' + msg.getSequence() + '] ' + msg.getData())
    })

})