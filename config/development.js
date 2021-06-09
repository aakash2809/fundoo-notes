const winston = require('winston');
require('dotenv').config();
/**
 * @exports : Exports developement Config Environment based Configuration
 *
 */
module.exports = () => ({
  port: process.env.DEV_PORT,
  MONGODB_URL: process.env.MONGODB_URL,
  AMQP_CONNECTION: process.env.AMQP_CONNECTION,
  CLIENT_URL: process.env.CLIENT_URL,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,

  logger: winston.createLogger({
    format: winston.format.json(),
    transports: [
      new winston.transports.File({
        filename: './logs/error.log',
        level: 'error',
      }),
      new winston.transports.File({
        filename: './logs/info.log',
        level: 'info',
      }),
    ],
  }),
});
