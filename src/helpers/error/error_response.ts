import {
  BAD_REQUEST_ERROR_CODE,
  VALIDATION_ERROR_CODE,
} from "../../common/config/app_config";

const generateValidationError = (message: string) => {
  return {
    code: VALIDATION_ERROR_CODE,
    message,
  };
};

const generateBadRequestError = (message: string) => {
  return {
    code: BAD_REQUEST_ERROR_CODE,
    message,
  };
};
const SESSION_EXPIRED = {
  code: 1,
  message: "Session expired. Please login again",
};

const INVALID_AUTHENTICATION = {
  code: 2,
  message: "Unable to authenticate request. Please login to continue",
};

const INVALID_USER_SESSION = {
  code: 3,
  message: "Invalid user session. Please login again",
};

const EMAIL_REQUIRED = {
  code: 4,
  message: "Email is required",
};

const generateNotFoundError = (item: string) => {
  return {
    code: 5,
    message: `This ${item} does not exist`,
  };
};

const PASSWORD_MISMATCH = {
  code: 6,
  message: "Passwords do not match",
};

const INVALID_LOGIN = {
  code: 8,
  message:
    "Invalid email or password. Kindly reset your password if you are not sure of your login details anymore",
};

const DUPLICATE_EMAIL = {
  code: 9,
  message: "A user with this email already exist, please try a different email",
};

const INACTIVE_ACCOUNT = {
  code: 12,
  message: "Your account is inactive",
};

const INVALID_TOKEN = {
  code: 15,
  message: "Invalid or expired token",
};

export {
  generateBadRequestError,
  generateValidationError,
  generateNotFoundError,
  SESSION_EXPIRED,
  INVALID_AUTHENTICATION,
  INVALID_USER_SESSION,
  EMAIL_REQUIRED,
  PASSWORD_MISMATCH,
  INVALID_LOGIN,
  DUPLICATE_EMAIL,
  INACTIVE_ACCOUNT,
  INVALID_TOKEN,
};
