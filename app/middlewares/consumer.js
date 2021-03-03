
/* const amqp = require("amqplib/callback_api");

class Subscriber {
    consumeMessage = (callback) => {
        try {
            console.log("inside subsciriber");
            amqp.connect("amqp://localhost", (error, connection) => {
                if (error) {
                    return callback(error, null);
                }
                connection.createChannel((error, channel) => {
                    if (error) {
                        return callback(error, null);
                    }
                    let queueName = "EmailInQueues1";
                    channel.assertQueue(queueName);
                    channel.consume(queueName, (msg) => {
            
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
module.exports = new Subscriber(); */

//const config = require('./config');
const amqplib = require('amqplib/callback_api');
const nodemailer = require('nodemailer');

// Setup Nodemailer transport
const transport = nodemailer.createTransport(/* {
    host: "http://localhost/3000",
    port: "3000",

    // we intentionally do not set any authentication
    // options here as we are going to use message specific
    // credentials

    // Security options to disallow using attachments from file or URL
    disableFileAccess: true,
    disableUrlAccess: true
}, {
    // Default options for the message. Used if specific values are not set
    from: "aakashrajak2809@gmail.com"
} */
    {
        service: "gmail",
        //port: process.env.PORT,
        secure: true, // use SSL
        /*  auth: {
             user: process.env.EMAIL_USER,
             pass: process.env.EMAIL_PASS,
         }, */
    }

);

// Create connection to AMQP server
amqplib.connect("amqp://localhost", (err, connection) => {
    if (err) {
        console.error(err.stack);
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

            // Only request 1 unacked message from queue
            // This value indicates how many messages we want to process in parallel
            channel.prefetch(1);

            // Set up callback to handle messages received from the queue
            channel.consume("EmailInQueues1", data => {
                if (data === null) {
                    return;
                }

                // Decode message contents
                let message = JSON.parse(data.content.toString());

                // attach message specific authentication options
                // this is needed if you want to send different messages from
                // different user accounts
                message.auth = {
                    user: "aakashrajak2809@gmail.com",
                    pass: "P@55worddell35",
                };

                // Send the message using the previously set up Nodemailer transport
                transport.sendMail(message, (err, info) => {
                    if (err) {

                        console.log("getting error in sending data", err);
                        // put the failed message item back to queue
                        return channel.nack(data);
                    }
                    console.log('Delivered message %s', info.messageId);
                    // remove message item from the queue
                    channel.ack(data);
                });
            });
        });
    });
});