import { Request } from 'express';
import winston from 'winston';

/**
 * A Utility class that provides methods used for logging
 */
class Logger {
  error(error: Error, request?: Request, metadata?: unknown) {
    winston.add(
      new winston.transports.Console({
        format: winston.format.prettyPrint(),
      })
    );

    winston.log({
      level: 'error',
      message: error.message,
      metadata,
      error,
      // request,
      time_stamp: new Date(),
    });
  }

  uncaughtException(error: Error, metadata?: unknown) {
    winston.add(
      new winston.transports.Console({
        format: winston.format.prettyPrint(),
      })
    );

    winston.log({
      level: 'error',
      message: error.message,
      metadata,
      error,
      time_stamp: new Date(),
    });
  }

  info(message: string, metadata?: unknown) {
    winston.add(
      new winston.transports.Console({
        format: winston.format.prettyPrint(),
      })
    );

    winston.log({
      level: 'info',
      message,
      metadata,
      time_stamp: new Date(),
    });
  }
}

const logger = new Logger();

export default logger;
