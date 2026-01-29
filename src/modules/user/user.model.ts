import { Document } from "mongoose";
import { Gender, UserStatus } from "./user.enums";
import { COUNTRY } from "../../common/countries.enum";
import { EntityModel } from "../../common/interface";

export interface IUser extends EntityModel {
  first_name: string;
  last_name: string;
  middle_name?: string;
  full_name?: string;
  gender: Gender;
  dob: Date;
  email: string;
  phone: string;
  address: string;
  country: COUNTRY;
  status: UserStatus;
  is_verified: boolean;
}

export interface IUserDocument extends IUser, Document {
  id: string;
}
