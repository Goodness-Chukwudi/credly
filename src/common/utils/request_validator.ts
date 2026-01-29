import { Router, NextFunction, Request, Response } from "express";
import Joi, { AnySchema } from "joi";
import date from '@joi/date';
import RouterMiddleware from "../../base/router.middleware";
import { BadRequestError, UnprocessableEntityError } from "../../helpers/error/app_error";
import { generateBadRequestError, generateValidationError } from "../../helpers/error/error_response";
import { JoiValidatorOptions } from "../config/app_config";


const JoiDate = Joi.extend(date);

class RequestValidator extends RouterMiddleware {
  constructor(appRouter: Router) {
    super(appRouter);
  }

  validateBody = (schema: AnySchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.body || !Object.keys(req.body).length) {
          const errorMessage = generateBadRequestError('Please provide a valid request body');
          return await this.handleError(res, new BadRequestError(errorMessage));
        }
        const cleanedBody = await schema.validateAsync(req.body, JoiValidatorOptions);
        req.body = cleanedBody;
        next();
      } catch (error) {
        const errorMessage = generateValidationError((error as Error).message);
        await this.handleError(res, new UnprocessableEntityError(errorMessage));
      }
    };
  };

  validateQuery = (schema: AnySchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await schema.validateAsync(req.query, JoiValidatorOptions);
        next();
      } catch (error) {
        const errorMessage = generateValidationError((error as Error).message);
        await this.handleError(res, new UnprocessableEntityError(errorMessage));
      }
    };
  };

  validateParams = (schema: AnySchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const cleanedParams = await schema.validateAsync(req.params, JoiValidatorOptions);
        req.params = cleanedParams;
        next();
      } catch (error) {
        const errorMessage = generateValidationError((error as Error).message);
        await this.handleError(res, new UnprocessableEntityError(errorMessage));
      }
    };
  };
}

const validString = Joi.string().trim().min(1).max(255);
const validRequiredString = Joi.string().trim().min(1).max(255).required();
const validNumber = Joi.number();
const validRequiredNumber = Joi.number().required();
const formattableDate = JoiDate.date().format('YYYY-MM-DD');
const formattableRequiredDate = JoiDate.date().format('YYYY-MM-DD').required();
const validDate = Joi.date();
const validRequiredDate = Joi.date().required();
const validIsoDate = Joi.date();
const validRequiredIsoDate = Joi.date().required();
const stringArray = Joi.array().items(Joi.string().trim().max(255));
const stringArrayRequired = Joi.array().items(Joi.string().trim().max(255)).required();
const numberArray = Joi.array().items(Joi.number());
const numberArrayRequired = Joi.array().items(Joi.number()).required();
const validEmail = Joi.string().email().lowercase();
const validRequiredEmail = Joi.string().email().lowercase().required();
const validBoolean = Joi.boolean();
const validRequiredBoolean = Joi.boolean().required();

const validPassword = Joi.string()
  .min(8)
  .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).+$'))
  .required()
  .messages({
    'string.min': 'Password must be at least {#limit} characters long',
    'string.pattern.base':
      'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character',
  });

const validConfirmPassword = Joi.string()
  .required()
  .valid(Joi.ref('password'))
  .messages({ 'any.only': 'Passwords do not match' });

export default RequestValidator;
export {
  validString,
  validRequiredString,
  validNumber,
  validRequiredNumber,
  validDate,
  validRequiredDate,
  formattableDate,
  formattableRequiredDate,
  validIsoDate,
  validRequiredIsoDate,
  stringArray,
  stringArrayRequired,
  numberArray,
  numberArrayRequired,
  validEmail,
  validRequiredEmail,
  validBoolean,
  validRequiredBoolean,
  validPassword,
  validConfirmPassword,
};
