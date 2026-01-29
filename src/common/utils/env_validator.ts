import Joi from "joi";
import {
  stringArrayRequired,
  validRequiredNumber,
  validRequiredString,
} from "./request_validator";
import { Environments } from "../config/app_config";
import Env from "../config/environment_variables";

function validateEnvironmentVariables() {
  const EnvSchema = Joi.object({
    NODE_ENV: validRequiredString.valid(...Object.values(Environments)),
    PORT: validRequiredNumber,
    ALLOWED_ORIGINS: stringArrayRequired.min(1),
    API_VERSION: validRequiredString,
    API_PATH: validRequiredString,
    JWT_SECRET: validRequiredString,
    JWT_AUDIENCE: validRequiredString,
    JWT_ISSUER: validRequiredString,
    JWT_EXPIRY: validRequiredNumber,
    MONGODB_URI: validRequiredString,
  });

  const response = EnvSchema.validate(Env, {
    allowUnknown: false,
    abortEarly: false,
  });
  if (response.error)
    throw new Error(`Env Validation Error: ${response.error.message}`);
}

export default validateEnvironmentVariables;
