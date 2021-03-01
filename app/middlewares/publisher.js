 const ampqp = require('amqplib/callback_api');
/*
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
 */
class Publish {
    getMessage = (userInfo, callback) => {
        //  logger.info("inside publisher");
        console.log("inside publisher");
        console.log("userInfo");
        console.log(userInfo);

        return amqp.connect("amqp://localhost", (error, connection) => {
            if (error) {
                //  logger.connect("Error while connecting to Rabbit Mq");
                return callback(error, null);
            }
            connection.createChannel((error, channel) => {
                if (error) {
                    //  logger.error("Error while creating chnannel");
                    return callback(error, null);
                }
                let queueName = "EmailInQueues1";
                let message = userInfo.emailId;
                channel.assertQueue(queueName, {
                    durable: false,
                });
                channel.sendToQueue(queueName, Buffer.from(message));
                console.log(`Message sends to queue : ${message}`);
                setTimeout(() => {
                    connection.close();
                }, 1000);
            });
        });
    };
}

module.exports = new Publish();



