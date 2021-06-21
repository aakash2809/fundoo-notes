/**
 * @module       middlewares
 * @file         JwtAuth.js
 * @description  This file contain Helper class which having methods related to auhorization token *                creation and sending the mails to users
 * @requires     nodemailer module for sending the mail to user
 * @requires     logger is a reference to save logs in log files
 * @requires     jsonwebtoken to create json web token
 * @author       Aakash Rajak <aakashrajak2809@gmail.com>
------------------------------------------------------------------------------------------*/

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const redis = require('redis');
require('dotenv').config();
const atob = require('atob');
const amqplib = require('amqplib');
const resposnsCode = require('../../util/staticFile.json');
const logger = require('../../config/logger');
const config = require('../../config/index').get();

const client = redis.createClient();

class Helper {
  /**
   * @description it genrate the token
   */
  genrateToken = (user) => {
    const token = jwt.sign(
      {
        username: user.name,
        userId: user._id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: '24h',
      },
    );
    client.setex('token', 5000, token);
    return token;
  };

  /**
 * @description it genrate the token
 */
  genrateTokenForSignUp = (user) => {
    const token = jwt.sign(
      {
        username: user.name,
        email: user.email,
        password: user.password,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: '20d',
      },
    );
    return token;
  };

  /**
 * @description this function return encodedbody from given token
 */
  getEncodedBodyFromHeader = (request) => {
    const token = request.headers.authorization.split('Bearer ')[1];
    const encodedBody = JSON.parse(atob(token.split('.')[1]));
    return encodedBody;
  }

  // Setup Nodemailer transport
  getTransport = () => {
    const transport = nodemailer.createTransport(
      {
        service: 'gmail',
        secure: true,
      },
    );
    return transport;
  }

  /**
   * @descriptioncreate create AMQP connection and return it.
   */
  getAmqpConnection = async () => {
    const connection = await amqplib.connect(config.AMQP_CONNECTION);
    return connection;
  }

  /**
   * @description create channel for AMQP and return it.
   */
  getAmqpChannel = async (connection) => {
    const channel = await connection.createChannel(connection);
    return channel;
  }

  /**
  * @description this function sending mail to activate the Account
  */
  sendMailToActivateAccount = (user, token) => new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      port: process.env.PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },

    });
    ejs.renderFile('app/views/activateEmail.ejs', {
      name: user.name,
      accountActivationLink: `${process.env.CLIENT_URL}/ActivateAccount/${token}`,
    }, (err, data) => {
      if (err) {
        logger.info('got error during sending error');
      } else {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: 'Activate account',
          html: data,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            reject(error);
          } else {
            info = `${process.env.CLIENT_URL}/ActivateAccount/${token}`;
            resolve(info);
          }
        });
      }
    });
  })

  /**
    * @description this function sending mail to for collabration
    */
  collabNotification = () => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    ejs.renderFile('app/views/collaborator.ejs', (error, info) => {
      if (error) {
        logger.info('error', error);
      } else {
        const mailOption = {
          from: process.env.EMAIL_USER,
          to: 'aakashrajak2809@gmail.com',
          subject: 'Collabration Notification',
          html: `${info}`,
        };
        transporter.sendMail(mailOption, (error, info) => {
          (error) ? logger.info('error to send mail', error) : logger.info('collaboration successfully, please check your email.', info.response);
        });
      }
    });
  }

  /**
   * @description this function verify the token
   */
  verifyToken = (request, response, next) => {
    try {
      const token = request.headers.authorization.split('Bearer ')[1];
      const decode = jwt.verify(token, process.env.SECRET_KEY);
      client.get('token', (error, result) => {
        if (error) throw error;
        if (token === result) {
          request.body = decode;
          next();
        }
      });
    } catch (error) {
      response.send({
        success: false,
        status_code: resposnsCode.BAD_REQUEST,
        message: 'Authentication failed',
      });
    }
  };

  /**
   * @description set key and data to redis
   */
  setDataToRedis = (KEY, data) => {
    client.setex(KEY, 120, JSON.stringify(data));
  }

  /**
   * @description get data from redis
   */
  getResponseFromRedis = (KEY, callback) => {
    client.get(KEY, (error, redisData) => {
      (error) ? (logger.info('error in retriving data from redis', error), callback(error, null))
        : (logger.info('Does not got error but data can be null'),
          callback(null, JSON.parse(redisData)));
    });
  }
}

module.exports = new Helper();
