/**
* @file          publisher.js
* @description   This file is publish the message
* @requires      ejs is a reference to render a template
* @requires      logger is a reference to save logs in log files
* @author        Aakash Rajak <aakashrajak2809@gmail.com>
*--------------------------------------------------------------------------------------*/
require('dotenv').config();
const ejs = require('ejs');
const amqplib = require('amqplib');
const logger = require('../../config/logger');

class Publish {
  /**
   * @description this function will send message(content) to queue
   * @param QUEUE contains the queue
   * @param channel is a channel to transmit the content
   * @param content contain content to be send
   * */
  sender = (QUEUE, channel, content, next) => {
    const sent = channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(content)), {
      persistent: true,
      contentType: 'application/json',
    });
    if (sent) {
      return next();
    }
    channel.once('drain', () => next());
  };

  /**
    * @description this function will send to consumer
    * @param userInfo contains user detail
    * @param token contains the token
    * */
  getMessage = async (userInfo, token) => {
    let connection = '';
    let channel = '';
    let sent = 0;
    const QUEUE = 'EmailInQueues1';
    try {
      connection = await amqplib.connect(process.env.AMQP_CONNECTION);
      channel = await connection.createChannel(connection);
      // Ensure queue for messages
      await channel.assertQueue(QUEUE);
      // push messages to queue
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
        this.sender(QUEUE, channel, {
          to: userInfo.email,
          subject: `Reset Password${sent}`,
          html: dataToSend,
          link: `${process.env.CLIENT_URL}/resetPassword/${token}`,
        }, sendNext);
      };
      sendNext();
    } catch (error) {
      logger.error(error);
      return process.exit(1);
    }
  }
}

module.exports = new Publish();
