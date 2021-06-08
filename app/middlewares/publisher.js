/**
* @file          publisher.js
* @description   This file is publish the message
* @requires      ejs          is a reference to render a template 
* @requires      logger       is a reference to save logs in log files
* @author        Aakash Rajak <aakashrajak2809@gmail.com>
*--------------------------------------------------------------------------------------*/

require('dotenv').config();
const ejs = require('ejs');
const amqplib = require('amqplib/callback_api');
const logger = require('../../config/logger');

class Publish {

  // Create connection to AMQP server
  createAmqpConnection = () => {
    return new Promise((resolve, reject) => {
      amqplib.connect(process.env.AMQP_CONNECTION).then((connection) => {
        resolve(connection);
      }).catch((err) => {
        reject(err);
      });
    });
  }
  // Create channel
  createChannel = (connection) => {
    return new Promise((resolve, reject) => {
      connection.createChannel().then((channel) => {
        resolve(channel);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  getMessage = async (userInfo, token) => {
    const connection = "";
    const channel = "";

    try {
      connection = await this.amqpConnection();
      channel = await this.createChannel(connection);

    } catch (error) {
      logger.error(error);
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
      }
      sendNext();
    });
  });
}
}
module.exports = new Publish();
