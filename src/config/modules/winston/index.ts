import {
    addColors,
    Logger,
    createLogger,
    format,
    transports,
    LoggerOptions
} from "winston";

const { splat, json, timestamp, align, printf } = format;

const config = {
    levels: {
        error: 0,
        debug: 1,
        warn: 2,
        data: 3,
        info: 4,
        verbose: 5,
        silly: 6,
        custom: 7
    },
    colors: {
        error: "red",
        debug: "blue",
        warn: "yellow",
        data: "grey",
        info: "green",
        verbose: "cyan",
        silly: "magenta",
        custom: "yellow"
    }
};

const logFormat = printf(info => {
    return JSON.stringify({
        timestamp: info.timestamp,
        context: info.context,
        level: info.level,
        userId: info.userId,
        query: info.query,
        variables: info.variables,
        code: info.code,
        path: info.path,
        stacktrace: info.stacktrace,
        message: info.message ? info.message : undefined
    });
});

const loggerOptions: LoggerOptions = {
    // level: "error",
    // levels: config.levels,
    format: format.combine(
        json(),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        align(),
        splat(),
        // prettyPrint(),
        // colorize(),
        logFormat
    ),
    // defaultMeta: { service: "user-service" },
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        // new transports.Console(),
        new transports.Console({
            level: "debug",
            handleExceptions: true
        })
    ],
    exitOnError: false
};

addColors(config.colors);

function createAppLogger(): Logger {
    return createLogger(loggerOptions);
}

const logger: Logger = createAppLogger();

const errorStream = {
    write: (message: unknown): void => {
        createLogger(loggerOptions).error(message);
    }
};

export { logger, loggerOptions, errorStream };
