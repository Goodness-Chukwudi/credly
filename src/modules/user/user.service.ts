import { ClientSession } from "mongoose";
import { createObjectId } from "../../common/utils/app_utils";
import { BadRequestError } from "../../helpers/error/app_error";
import { DUPLICATE_EMAIL } from "../../helpers/error/error_response";
import passwordRepo from "../authentication/password/password.repo";
import { CreateUserDTO } from "./user.dto";
import userRepo from "./user.repo";

const createNewUser = async (
  userDetails: CreateUserDTO,
  session: ClientSession,
) => {
  const existingUser = await userRepo.findOne({
    email: userDetails.email,
  });
  if (existingUser) throw new BadRequestError(DUPLICATE_EMAIL);

  const userData = {
    ...userDetails,
    _id: createObjectId(),
  };

  const user = await userRepo.save(userData, { session });

  const password = {
    password: userDetails.password,
    email: userData.email,
    user: userData._id,
  };
  await passwordRepo.save(password, { session });
  return user;
};

export { createNewUser };
