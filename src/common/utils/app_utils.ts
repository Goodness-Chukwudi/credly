import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { Types } from 'mongoose';

/**
 * Records and logs the response time for http requests
 * @returns {void}
 */
const recordResponseTime = (req: Request, res: Response, time: number) => {
  console.log(`${req.method}: ${req.originalUrl} => ${time.toFixed(3)} ms `, res.statusCode); // eslint-disable-line no-console
};


const uuid = (): string => {
  return randomUUID();
};

const createObjectId = () => {
  return new Types.ObjectId();
};

/**
 * Maps a source object to a target type, only keeping keys defined in the target.
 * Useful for formatting DB objects before sending in responses.
 */
const mapTo = <T>(source: Partial<Record<keyof T, unknown>>, fields?: (keyof T)[]): T => {
  const target: Record<string, unknown> = {};

  for (const key in source) {
    if ((Object.prototype.hasOwnProperty.call(source, key) && fields?.includes(key)) || !fields) {
      // Only copy properties that exist in source or if no fields were provided copy all properties
      target[key] = source[key];
    }
  }

  const id = (source as Record<string, unknown>)?._id;
  if (id) target.id = id;

  return target as T;
};

export {
  recordResponseTime,
  uuid,
  createObjectId,
  mapTo,
};
