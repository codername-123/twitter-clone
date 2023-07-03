import winston from "winston";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

function logLevel() {
  const env = process.env.NODE_ENV || "development";
  return env === "development" ? "debug" : "warn";
}

const colors = {
  error: "red",
  warn: "yellow",
  info: "blue",
  http: "white",
  debug: "green",
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: `YYYY-MM-DD HH:mm:ss` }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (data) => `${data.timestamp} ${data.level}: ${data.message}`
  )
);

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
  }),
  new winston.transports.File({
    filename: "logs/combined.log",
  }),
];

const logger = winston.createLogger({
  level: logLevel(),
  levels,
  format,
  transports,
});

export default logger;
