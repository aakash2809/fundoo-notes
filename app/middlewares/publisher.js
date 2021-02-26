
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
        //send message to queue
        channel.sendToQueue(QUEUE, Buffer.from('this is for the coding test'));
        console.log(`Message send ${QUEUE}`);
    })
})

