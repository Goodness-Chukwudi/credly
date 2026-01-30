const VALIDATION_ERROR_CODE = 0;

const generateValidationError = (message: string) => {
  return {
    code: VALIDATION_ERROR_CODE,
    message,
  };
};

const generateBadRequestError = (message: string) => {
  return {
    code: 1,
    message,
  };
};
const SESSION_EXPIRED = {
  code: 2,
  message: "Session expired. Please login again",
};

const INVALID_AUTHENTICATION = {
  code: 3,
  message: "Unable to authenticate request. Please login to continue",
};

const INVALID_USER_SESSION = {
  code: 4,
  message: "Invalid user session. Please login again",
};

const EMAIL_REQUIRED = {
  code: 5,
  message: "Email is required",
};

const generateNotFoundError = (item: string) => {
  return {
    code: 6,
    message: `This ${item} does not exist`,
  };
};

const PASSWORD_MISMATCH = {
  code: 7,
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
  code: 10,
  message: "Your account is inactive",
};

const INVALID_TOKEN = {
  code: 11,
  message: "Invalid or expired token",
};

const ACCESS_DENIED = {
  code: 12,
  message: "You do not have permission to perform this action",
};

export {
  generateBadRequestError,
  generateValidationError,
  generateNotFoundError,
  VALIDATION_ERROR_CODE,
  SESSION_EXPIRED,
  INVALID_AUTHENTICATION,
  INVALID_USER_SESSION,
  EMAIL_REQUIRED,
  PASSWORD_MISMATCH,
  INVALID_LOGIN,
  DUPLICATE_EMAIL,
  INACTIVE_ACCOUNT,
  INVALID_TOKEN,
  ACCESS_DENIED,
};
