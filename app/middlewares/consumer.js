const ampqp = require('amqplib/callback_api');

//create connection
ampqp.connect('amqp://localhost', (connError, connection) => {
    if (connError) {
        throw connError;
    }
    //create channal
    connection.createChannel((channelError, channel) => {
        if (channelError) {
            throw channelError;
        }
        //assert Queue
        const QUEUE = 'aakashrajak2809@gmail';
        channel.assertQueue(QUEUE);
        //recieve message 
        channel.consume(QUEUE, (msg) => {
            console.log(`Message recieved : ${msg.content}`);
        }, {
            noAck: true
        })
    })
})