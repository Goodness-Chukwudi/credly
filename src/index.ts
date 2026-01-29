import http from 'http';
import app from './app';
import Env from './common/config/environment_variables';
import validateEnvironmentVariables from './common/utils/env_validator';
import logger from './common/utils/logger';
import { connectToDB } from './helpers/db';

validateEnvironmentVariables();

const server = http.createServer(app);
server.timeout = 60 * 1000; // 60s

connectToDB()
  .then(async () => {
    server.listen(Env.PORT, () => {
      console.log(`App is listening on port: ${Env.PORT}`); // eslint-disable-line no-console
    });
  })
  .catch(() => {
    console.log('DB Connection not successful'); // eslint-disable-line no-console
  });

process.on('unhandledRejection', (reason: string, metadata: unknown) => {
  const error = new Error(reason);
  logger.uncaughtException(error, metadata);
  process.exit(1);
});

process.on('uncaughtException', (error: Error) => {
  logger.uncaughtException(error);
  process.exit(1);
});
