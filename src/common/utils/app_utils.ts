import { Request, Response } from "express";
import { randomUUID } from "crypto";
import { Types } from "mongoose";

/**
 * Records and logs the response time for http requests
 * @returns {void}
 */
const recordResponseTime = (req: Request, res: Response, time: number) => {
  // eslint-disable-next-line no-console
  console.log(
    `${req.method}: ${req.originalUrl} => ${time.toFixed(3)} ms `,
    res.statusCode,
  );
};

const uuid = (): string => {
  return randomUUID();
};

const createObjectId = () => {
  return new Types.ObjectId();
};

export { recordResponseTime, uuid, createObjectId };
