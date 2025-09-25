import winston, { Logger } from "winston";
import path from "path";

export class TestLogger {
  private static instance: TestLogger;
  private logger: Logger;

  private constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || "info",
      format: winston.format.combine(
        winston.format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta: { service: "playwright-tests" },
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
        }),
        new winston.transports.File({
          filename: path.join("logs", "error.log"),
          level: "error",
        }),
        new winston.transports.File({
          filename: path.join("logs", "combined.log"),
        }),
      ],
    });

    const fs = require("fs");
    if (!fs.existsSync("logs")) {
      fs.mkdirSync("logs");
    }
  }

  public static getInstance(): TestLogger {
    if (!TestLogger.instance) {
      TestLogger.instance = new TestLogger();
    }
    return TestLogger.instance;
  }

  public info(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  public error(message: string, error?: Error | any): void {
    this.logger.error(message, { error: error?.stack || error });
  }

  public warn(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }

  public debug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }

  public step(stepName: string, meta?: any): void {
    this.logger.info(`STEP: ${stepName}`, meta);
  }

  public testStart(testName: string): void {
    this.logger.info(`TEST STARTED: ${testName}`);
  }

  public testEnd(
    testName: string,
    status: "PASSED" | "FAILED" | "SKIPPED"
  ): void {
    this.logger.info(`TEST ${status}: ${testName}`);
  }
}

export const logger = TestLogger.getInstance();