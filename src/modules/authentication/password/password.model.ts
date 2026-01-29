import { Document } from "mongoose";
import { IUser, IUserDocument } from "../../user/user.model";
import { PASSWORD_STATUS } from "./password.enum";
import { DbId, EntityModel } from "../../../common/interface";

interface IPassword extends EntityModel {
  password: string;
  email: string;
  user: DbId | IUserDocument | IUser;
  status: PASSWORD_STATUS;
}

interface IPasswordDocument extends IPassword, Document {
  id: string;
}

export type { IPassword, IPasswordDocument };
