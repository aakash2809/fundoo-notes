const winston = require('winston');

/**
 * @exports : Exports developement Config Environment based Configuration
 */
module.exports = () => ({
  port: process.env.PROD_PORT,
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

  redisClientConfig: {
    port: process.env.REDIS_PORT,
    flushRedisOnServerRestart: true,
  },
});
