import dotenv from "dotenv";
dotenv.config();
interface IEnv {
  NODE_ENV: string;
  PORT: number;
  ALLOWED_ORIGINS: string[];
  API_VERSION: string;
  API_PATH: string;
  JWT_SECRET: string;
  JWT_AUDIENCE: string;
  JWT_ISSUER: string;
  JWT_EXPIRY: number;
  MONGODB_URI: string;
}

const Env: IEnv = {
  NODE_ENV: process.env.NODE_ENV as string,
  PORT: process.env.PORT as unknown as number,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(", ") as string[],
  API_VERSION: process.env.API_VERSION as string,
  API_PATH: "/api/" + process.env.API_VERSION,
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_AUDIENCE: process.env.JWT_AUDIENCE as string,
  JWT_ISSUER: process.env.JWT_ISSUER as string,
  JWT_EXPIRY: Number(process.env.JWT_EXPIRY),
  MONGODB_URI: process.env.MONGODB_URI as string,
};

export default Env;
