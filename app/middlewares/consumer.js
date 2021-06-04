require("dotenv").config();
const amqplib = require('amqplib/callback_api');
const nodemailer = require('nodemailer');
const logger = require("../../config/logger");

class Subscriber {

    consumeMessage = (callback) => {
        // Setup Nodemailer transport
        const transport = nodemailer.createTransport(
            {
                service: "gmail",
                secure: true,
            }
        );

        // Create connection to AMQP server
        amqplib.connect("amqp://localhost", (err, connection) => {
            if (err) {
                return callback(err, null);
            }
            // Create channel
            connection.createChannel((err, channel) => {
                if (err) {
                    return callback(err, null);
                }

                // Ensure queue for messages
                channel.assertQueue("EmailInQueues1", {
                    // Ensure that the queue is not deleted when server restarts
                    durable: true
                }, err => {
                    if (err) {
                        return callback(err, null);
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
                            user: process.env.EMAIL_USER,
                            pass: process.env.EMAIL_PASS,
                        };

                        // Send the message using the previously set up Nodemailer transport
                        transport.sendMail(message, (err, info) => {
                            if (err) {
                                logger.info("getting error in sending data", err);
                                // put the failed message item back to queue
                                return channel.nack(data);
                            }
                            logger.info('Delivered message %s', info.messageId);
                            // remove message item from the queue
                            channel.ack(data);
                            callback(null, message.link);
                        });
                    });
                });
            });
        });
    }
}

module.exports = new Subscriber();