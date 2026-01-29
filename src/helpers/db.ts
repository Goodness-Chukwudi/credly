import mongoose, { ClientSession } from "mongoose";
import Env from "../common/config/environment_variables";

const connectToDB = async () => {
  return connectToMongoDbUsingMongoose();
};

async function connectToMongoDbUsingMongoose() {
  return new Promise((resolve, reject) => {
    try {
      mongoose.connect(Env.MONGODB_URI);
      mongoose.connection.on("error", (err) => {
        // eslint-disable-next-line no-console
        console.error(
          "Unable to connect to MongoDB via Mongoose\n" + err.message,
        );
        reject(err);
      });

      mongoose.connection.once("open", async () => {
        console.log("Connected to MongoDB via Mongoose"); // eslint-disable-line no-console
        resolve(true);
      });
    } catch (error) {
      console.log(error); // eslint-disable-line no-console
      reject(error);
    }
  });
}

const createDbSession = async (): Promise<ClientSession> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  return session;
};

export { createDbSession, connectToDB };
