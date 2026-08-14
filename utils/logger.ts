import winston from "winston";

const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.prettyPrint(),
);

const logger = winston.createLogger({
    level: "info",
    format: logFormat,
    transports: [new winston.transports.File({ filename: "app.log" }), new winston.transports.Console()],
});

logger.info("Starting app");
logger.error(new Error("new error"));

export default logger;