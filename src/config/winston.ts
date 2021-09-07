import * as winston from 'winston';

const logFormat = winston.format.printf(({level, message, timestamp}) => {
    return `[${timestamp}] - [${level}]: ${message}`;
});

export const logger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console(),
        new winston.transports.File(
            {
                level: 'debug',
                filename: './logs/all.log',
                maxsize: 10000000,
            }
        ),
        new winston.transports.File(
            {
                level: 'error',
                filename: './logs/error.log',
                maxsize: 10000000,
            }),
    ],
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        logFormat
    )
});

export const reqLogger = {
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: './logs/requests.log',
            maxsize: 10000000,
        }),
        new winston.transports.File({
            filename: './logs/all.log',
            maxsize: 10000000,
        })
    ],
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.json()
    ),
    msg: "{{req.method}} {{req.url}}",
    expressFormat: true,
}
