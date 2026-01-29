import { Document } from "mongoose";
import { EntityModel } from "../../common/interface";
import { AdminDepartment, AdminTier } from "./admin.enum";
import { Gender, UserStatus } from "../user/user.enums";

export interface IAdmin extends EntityModel {
  first_name: string;
  last_name: string;
  middle_name?: string;
  full_name?: string;
  department: AdminDepartment;
  tier: AdminTier;
  gender: Gender;
  dob: Date;
  email: string;
  phone: string;
  status: UserStatus;
}

export interface IAdminDocument extends IAdmin, Document {
  id: string;
}
