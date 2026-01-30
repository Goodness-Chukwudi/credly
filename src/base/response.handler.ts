import { Response } from "express";
import { ClientSession } from "mongoose";
import logger from "../common/utils/logger";
import { AppError } from "../helpers/error/app_error";
import { VALIDATION_ERROR_CODE } from "../helpers/error/error_response";

abstract class ResponseHandler {
  /**
   * Terminates the http request with the provided express res object.
   * An error response is created with the provided error details and returned to the client.
   * @param {Request} res The express response object to be used to send the error response
   * @param {AppError} error The error object. This is only for log purposes and it's not returned to client
   * @param {*} data Optional data to return to client
   * @returns {void} void
   */
  protected async handleError(
    res: Response,
    error: Error,
    data?: unknown,
    session?: ClientSession,
  ) {
    if (session) await session.abortTransaction();

    try {
      let statusCode = 500;
      let errorCode;
      let errorData;
      let message = error.message;
      let errors;

      if (error instanceof AppError) {
        statusCode = error.status_code;
        errorData = error.data;
        errors =
          error.custom_code === VALIDATION_ERROR_CODE
            ? error.message.split(". ")
            : [error.message];
        errorCode = error.custom_code;
      } else {
        logger.error(error, res.req);
        message =
          "Unable to complete request. Please try again later or contact support if issue persists";
        errors = [message];
      }

      const response = {
        message,
        errors,
        success: false,
        error_code: errorCode,
        status_code: statusCode,
        data: data || errorData,
      };

      return res.status(statusCode).json(response);
    } catch (error) {
      logger.error(error as Error, res.req);

      const message =
        "Unable to complete request. Please try again later or contact support if issue persists";
      const response = {
        message,
        errors: [message],
        success: false,
        status_code: 500,
      };

      return res.status(500).json(response);
    }
  }

  /**
   * Terminates the http request with the provided express res object.
   * A success response is created and an optional data object data returned to the client.
   * @param {Response} res The express response object to be used to send the success response
   * @param {*} data An optional data to be returned to the user
   * @param {number} statusCode HTTP status code of the success response
   * @returns  void
   */
  protected async handleSuccess(
    res: Response,
    data?: unknown,
    statusCode = 200,
    session?: ClientSession,
  ) {
    try {
      if (session) await session.commitTransaction();

      const response = {
        success: true,
        data,
        status_code: statusCode,
      };
      return res.status(statusCode).json(response);
    } catch (error) {
      logger.error(error as Error, res.req);

      const message =
        "Unable to complete request. Please try again later or contact support if issue persists";
      const response = {
        message,
        errors: [message],
        success: false,
        status_code: 500,
      };

      return res.status(500).json(response);
    }
  }
}

export default ResponseHandler;
