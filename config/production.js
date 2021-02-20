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
            port: process.env.REDIS_PORT,
            flushRedisOnServerRestart: true,
        },
    };
};