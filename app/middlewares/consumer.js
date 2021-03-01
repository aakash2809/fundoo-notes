/* const ampqp = require('amqplib/callback_api');

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
 */
const amqp = require("amqplib/callback_api");


class Subscriber {
    consumeMessage = (callback) => {
        try {
            console.log("inside subsciriber");
            amqp.connect("amqp://localhost", (error, connection) => {
                if (error) {
                    //   logger.connect("Error while connecting to Rabbit Mq");
                    return callback(error, null);
                }
                connection.createChannel((error, channel) => {
                    if (error) {
                        //  logger.error("Error while creating chnannel");
                        return callback(error, null);
                    }
                    let queueName = "EmailInQueues1";
                    channel.assertQueue(queueName, {
                        durable: false,
                    });
                    channel.consume(queueName, (msg) => {
                        console.log("mess");
                        console.log(`Message consumes: ${msg.content.toString()}`);
                        channel.ack(msg);
                        return callback(null, msg.content.toString());
                    });
                });
            });
        } catch (error) {
            console.log("error", error);
        }
    };
}
module.exports = new Subscriber();