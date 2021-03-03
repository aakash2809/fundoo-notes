const amqp = require('amqplib/callback_api');

/* getMessage = (userInfo, callback) => {
    console.log("inside publisher");
    console.log("userInfo");
    console.log(userInfo);

    const ampqp = require('amqplib/callback_api');

    //create connection
    ampqp.connect('amqp://localhost', (connError, connection) => {
        if (connError) {
            return callback(connError, null);
        }
        //create channal
        connection.createChannel((channelError, channel) => {
            if (channelError) {
                return callback(channelError, null);
            }
            //assert Queue
            let queueName = "EmailInQueues1";
            let message = userInfo.emailId;
            channel.assertQueue(queueName, {
                durable: false,
            });
            /*  const QUEUE = 'aakashrajak2809@gmail';
             channel.assertQueue(QUEUE); */
//send message to queue
/* channel.sendToQueue(queueName, Buffer.from(message));
console.log(`Message sends to queue ${message}`);
})
})
} 
*/

//const amqp = require("amqplib/callback_api");

class Publish {
    getMessage = (userInfo, callback) => {
        console.log("inside publisher");
        console.log("userInfo");
        console.log(userInfo);

        amqp.connect("amqp://localhost", (error, connection) => {
            console.log("connection error ", error)
            console.log("connection  ", connection)
            if (error) {
                //  logger.connect("Error while connecting to Rabbit Mq");

                return callback(error, null);
            }
            connection.createChannel((error, channel) => {
                if (error) {
                    //  logger.error("Error while creating chnannel");
                    return callback(error, null);
                }
                console.log("hello");
                let queueName = "EmailInQueues1";
                let message = userInfo;
                channel.assertQueue(queueName);
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


