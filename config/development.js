const winston = require("winston");

/**
 * @exports : Exports developement Config Environment based Configuration
 *
 */
module.exports = () => {
  return {
    port: process.env.PORT || 3000,
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

    redisClientConfig: {
      redisEndPoint: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      flushRedisOnServerRestart: true,
    },
    database: {
      mongodb: {
        // MONGODB_URL=mongodb://localhost:27017/fundooNotes
        dbURI: `mongodb+srv://${process.env.HOST}/${process.env.fundooNotes}`,

        // dbURL: process.env.MONGODB_URL,
      },
    },
  };
};