/* const amqp = require('amqplib/callback_api');

class Publish {
    getMessage = (userInfo, callback) => {
        console.log("inside publisher");
        console.log("userInfo");
        console.log(userInfo);

        amqp.connect("amqp://localhost", (error, connection) => {
            console.log("connection error ", error)
            console.log("connection  ", connection)
            if (error) {
                //logger.connect("Error while connecting to Rabbit Mq");

                return callback(error, null);
            }
            connection.createChannel((error, channel) => {
                if (error) {
                    // logger.error("Error while creating chnannel");
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


 */
require("dotenv").config();
var ejs = require("ejs");
const amqplib = require('amqplib/callback_api');
var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFobWFkIEFsaSIsInVzZXJJZCI6IjYwMjhjNjQ1ODhlMTkyMWNkNDQ2YTMxYSIsImlhdCI6MTYxNDc2MTM5MywiZXhwIjoxNjE0ODQ3NzkzfQ.AMIkrlOycrXzJwyIanVOAdRzFXlv9H8y4ob9oGLGN1s"

// Create connection to AMQP server
amqplib.connect("amqp://localhost", (err, connection) => {

    if (err) {
        console.error(err);
        return process.exit(1);
    }

    // Create channel
    connection.createChannel((err, channel) => {
        if (err) {
            console.error(err.stack);
            return process.exit(1);
        }

        // Ensure queue for messages
        channel.assertQueue("EmailInQueues1", {
            // Ensure that the queue is not deleted when server restarts
            durable: true
        }, err => {
            if (err) {
                console.error(err.stack);
                return process.exit(1);
            }

            // Create a function to send objects to the queue
            // Javascript object is converted to JSON and then into a Buffer
            let sender = (content, next) => {
                let sent = channel.sendToQueue("EmailInQueues1", Buffer.from(JSON.stringify(content)), {
                    // Store queued elements on disk
                    persistent: true,
                    contentType: 'application/json'
                });
                if (sent) {
                    return next();
                } else {
                    channel.once('drain', () => next());
                }
            };

            // push 100 messages to queue
            let sent = 0;
            let sendNext = async () => {
                let dataToSend = await ejs.renderFile(
                    "app/views/forgotPassword.ejs",
                    {
                        name: "Raju",
                        resetLink: `${process.env.CLIENT_URL}/resetpassword/${token}`,
                    })
                if (sent >= 2) {
                    console.log('All messages sent!');
                    // Close connection to AMQP server
                    // We need to call channel.close first, otherwise pending
                    // messages are not written to the queue
                    return channel.close(() => connection.close());
                }
                sent++;
                sender({
                    to: 'aakashrajak2809@gmail.com',
                    subject: 'Test message #' + sent,
                    html: dataToSend
                }, sendNext);
            };
            sendNext();
        });
    });
});

