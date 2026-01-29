import { Document } from "mongoose";
import { EntityModel, DbId } from "../../../common/interface";
import { IUserDocument, IUser } from "../../user/user.model";
import { BIT, SessionDeactivationReason } from "./login_session.enum";


interface ILoginSession extends EntityModel {
  user: DbId | IUserDocument | IUser;
  status: BIT;
  expiry_date: Date;
  logged_out_at?: Date;
  logged_out: boolean;
  expired: boolean;
  deactivation_reason: SessionDeactivationReason;
  os: string;
  version: string;
  device_name: string;
  device_id: string;
  ip: string;
  ip_based_login_location: string;
  ip_based_login_country: string;
  is_mobile: boolean;
}

interface ILoginSessionDocument extends ILoginSession, Document {
  id: string;
}

export type { ILoginSession, ILoginSessionDocument };
