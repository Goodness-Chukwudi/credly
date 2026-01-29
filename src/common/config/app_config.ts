import Env from "./environment_variables";

const Environments = Object.freeze({
  PROD: "production",
  STAGING: "staging",
  DEV: "development",
  UAT: "user-acceptance-test",
});

const JoiValidatorOptions = {
  errors: {
    wrap: {
      label: "",
    },
  },
  stripUnknown: { objects: true },
  abortEarly: false,
  allowUnknown: false,
};

const IS_DEV = Env.NODE_ENV === Environments.DEV;

const VALIDATION_ERROR_CODE = 0;
const BAD_REQUEST_ERROR_CODE = -1;
const TOKEN_ALGORITHM = "HS256";

export {
  Environments,
  JoiValidatorOptions,
  VALIDATION_ERROR_CODE,
  BAD_REQUEST_ERROR_CODE,
  TOKEN_ALGORITHM,
  IS_DEV,
};
