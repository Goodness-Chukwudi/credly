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
const TOKEN_ALGORITHM = "HS256";

export { Environments, JoiValidatorOptions, TOKEN_ALGORITHM, IS_DEV };
