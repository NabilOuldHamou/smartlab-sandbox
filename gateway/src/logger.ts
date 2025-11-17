import pino from "pino";
import path from "path";

const logDir = path.join(process.cwd(), "logs");

export const logger = pino(
  {
    level: process.env.LOG_LEVEL || "info",
  },
  pino.transport({
    targets: [
      {
        level: "info",
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      },
      {
        level: "info",
        target: "pino/file",
        options: {
          destination: path.join(logDir, "app.log"),
          mkdir: true,
        },
      },
    ],
  })
);
