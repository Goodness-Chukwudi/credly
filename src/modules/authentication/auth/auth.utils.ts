import { Request } from "express";
import Jwt, { SignOptions, VerifyCallback } from "jsonwebtoken";
import { AccessTokenPayload } from "./auth.dto";
import bcrypt from "bcrypt";
import { TOKEN_ALGORITHM } from "../../../common/config/app_config";
import Env from "../../../common/config/environment_variables";

/**
 * Generates an access token. Signs the provided payload into the token
 * @param {AccessTokenPayload} payload the payload to be signed into the token
 * @returns {string} a signed jwt token
 */
const generateAccessToken = (payload: AccessTokenPayload): string => {
  const token = Jwt.sign(payload, Env.JWT_SECRET, {
    algorithm: TOKEN_ALGORITHM,
    expiresIn: Env.JWT_EXPIRY,
    audience: Env.JWT_AUDIENCE,
    issuer: Env.JWT_ISSUER,
  } as SignOptions);

  return token;
};

/**
 * Verifies a jwt token and decodes the payload
 * @param {string} token the jwt token to be verified
 * @param {string} tokenId the id of the user that owns the token
 * @param callback
 * @returns {AccessTokenPayload}
 */
const verifyAccessToken = (
  token: string,
  callback: VerifyCallback<AccessTokenPayload>,
) => {
  Jwt.verify(
    token,
    Env.JWT_SECRET,
    {
      algorithms: [TOKEN_ALGORITHM],
      audience: Env.JWT_AUDIENCE,
      issuer: Env.JWT_ISSUER,
    },
    (err, decoded) => {
      callback(err, decoded as AccessTokenPayload);
    },
  );
};

const hashData = async (data: string, rounds = 12): Promise<string> => {
  const salt = await bcrypt.genSalt(rounds);
  return bcrypt.hash(data, salt);
};

/**
 * Compares and validates the equality of a value with a hashed data
 * @param {string} value the value to be compared with a hashed data
 * @param {string} hashedData the hashed data to compare with the provided value
 * @returns {boolean} A promise that resolves to boolean. Returns true if the two values are equal, other wise false
 */
const validateHashedData = async (
  value: string,
  hashedData: string,
): Promise<boolean> => {
  if (!value || !hashedData) {
    throw new Error(
      "Either the hashed data or values to compare with it, is not provided",
    );
  }

  return await bcrypt.compare(value, hashedData);
};

/**
 * Retrieves the bearer token from the authorization header of an express request
 * @param {Request} req an instance of the express request to get the token from
 * @returns {string}  a string
 */
const getTokenFromRequest = (req: Request): string => {
  const authorization = req.headers.authorization || "";
  let jwt = "";
  if (authorization) {
    if (authorization.split(" ").length > 1) {
      jwt = authorization.split(" ")[1];
    }
  }
  return jwt;
};

export {
  getTokenFromRequest,
  validateHashedData,
  hashData,
  generateAccessToken,
  verifyAccessToken,
};
