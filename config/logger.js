/**
 * @module        config
 * @file          logger.js
 * @description   This file contains the defination of winston transports
 * @requires      {@link https://www.npmjs.com/package/winston | winston}
 * @author        Aakash Rajak <aakashrajak2809@gmail.com>
*  @since        
------------------------------------------------------------------------------------------*/

const winston = require('winston');

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: './logs/info.log',
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD'
        }),
        winston.format.printf(
          info => `${info.timestamp} ${info.level}: ${info.message}`
        )
      )
    }),

    new winston.transports.File({
      level: 'error',
      filename: './logs/error.log',
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD'
        }),

        winston.format.printf(
          error => `${error.timestamp} ${error.level}: ${error.message}`
        )
      )
    })]
});

module.exports = logger;