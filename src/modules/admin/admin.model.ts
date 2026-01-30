import { Document } from "mongoose";
import { DbId, EntityModel } from "../../common/interface";
import { AdminDepartment, AdminTier, AdminType } from "./admin.enum";
import { IUser, IUserDocument } from "../user/user.model";

export interface IAdmin extends EntityModel {
  user: DbId | IUserDocument | IUser;
  department: AdminDepartment;
  tier: AdminTier;
  type: AdminType;
  is_active: boolean;
}

export interface IAdminDocument extends IAdmin, Document {
  id: string;
}
