const winston = require("winston");
require("dotenv").config();
/**
 * @exports : Exports developement Config Environment based Configuration
 *
 */
module.exports = () => {
  return {
    port: process.env.DEV_PORT,
    MONGODB_URL: process.env.MONGODB_URL,
    logger: winston.createLogger({
      format: winston.format.json(),
      transports: [
        new winston.transports.File({
          filename: "./log/error.log",
          level: "error",
        }),
        new winston.transports.File({
          filename: "./log/info.log",
          level: "info",
        }),
      ],
    }),
  };
};