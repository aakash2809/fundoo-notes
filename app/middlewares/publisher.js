require('dotenv').config();
const ejs = require('ejs');
const amqplib = require('amqplib/callback_api');
const logger = require('../../config/logger');

class Publish {
    getMessage = (userInfo, token) => {
      // Create connection to AMQP server
      amqplib.connect('amqp://localhost', (err, connection) => {
        if (err) {
          logger.error(err);
          return process.exit(1);
        }

        // Create channel
        connection.createChannel((err, channel) => {
          if (err) {
            logger.error(err.stack);
            return process.exit(1);
          }

          // Ensure queue for messages
          channel.assertQueue('EmailInQueues1', {
            // Ensure that the queue is not deleted when server restarts
            durable: true,
          }, (err) => {
            if (err) {
              return process.exit(1);
            }

            // Create a function to send objects to the queue
            // Javascript object is converted to JSON and then into a Buffer
            const sender = (content, next) => {
              const sent = channel.sendToQueue('EmailInQueues1', Buffer.from(JSON.stringify(content)), {
                // Store queued elements on disk
                persistent: true,
                contentType: 'application/json',
              });
              if (sent) {
                return next();
              }
              channel.once('drain', () => next());
            };

            // push messages to queue
            let sent = 0;
            const sendNext = async () => {
              const dataToSend = await ejs.renderFile(
                'app/views/forgotPassword.ejs',
                {
                  name: userInfo.name,
                  resetLink: `${process.env.CLIENT_URL}/resetPassword/${token}`,
                },
              );
              if (sent >= 1) {
                logger.info(' messages sent!');
                // Close connection to AMQP server
                // We need to call channel.close first, otherwise pending
                // messages are not written to the queue
                return channel.close(() => connection.close());
              }
              sent++;
              sender({
                to: userInfo.email,
                subject: `Reset Password${sent}`,
                html: dataToSend,
                link: `${process.env.CLIENT_URL}/resetPassword/${token}`,
              }, sendNext);
            };
            sendNext();
          });
        });
      });
    }
}

module.exports = new Publish();
