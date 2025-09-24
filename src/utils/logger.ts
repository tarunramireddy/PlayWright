import winston, { Logger } from 'winston';
import path from 'path';

/**
 * Custom logger utility using Winston
 */
export class TestLogger {
  private static instance: TestLogger;
  private logger: Logger;

  private constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta: { service: 'playwright-tests' },
      transports: [
        // Console transport
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        }),
        // File transport for errors
        new winston.transports.File({
          filename: path.join('logs', 'error.log'),
          level: 'error'
        }),
        // File transport for all logs
        new winston.transports.File({
          filename: path.join('logs', 'combined.log')
        })
      ]
    });

    // Create logs directory if it doesn't exist
    const fs = require('fs');
    if (!fs.existsSync('logs')) {
      fs.mkdirSync('logs');
    }
  }

  /**
   * Get singleton instance of TestLogger
   */
  public static getInstance(): TestLogger {
    if (!TestLogger.instance) {
      TestLogger.instance = new TestLogger();
    }
    return TestLogger.instance;
  }

  /**
   * Log info message
   */
  public info(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  /**
   * Log error message
   */
  public error(message: string, error?: Error | any): void {
    this.logger.error(message, { error: error?.stack || error });
  }

  /**
   * Log warning message
   */
  public warn(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }

  /**
   * Log debug message
   */
  public debug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }

  /**
   * Log test step
   */
  public step(stepName: string, meta?: any): void {
    this.logger.info(`STEP: ${stepName}`, meta);
  }

  /**
   * Log test start
   */
  public testStart(testName: string): void {
    this.logger.info(`TEST STARTED: ${testName}`);
  }

  /**
   * Log test end
   */
  public testEnd(testName: string, status: 'PASSED' | 'FAILED' | 'SKIPPED'): void {
    this.logger.info(`TEST ${status}: ${testName}`);
  }
}

/**
 * Export singleton instance
 */
export const logger = TestLogger.getInstance();