import { Schema, model } from "mongoose";
import Env from "../../../common/config/environment_variables";
import MODEL_NAMES from "../../../common/model_manifest";
import {
  DefaultSchemaFields,
  RequiredObjectIdType,
  TrimmedString,
  TrimmedRequiredString,
  createSchema,
} from "../../../helpers/schema";
import { BIT, SessionDeactivationReason } from "./login_session.enum";
import { ILoginSession } from "./login_session.model";

const Types = Schema.Types;

const schemaFields: Record<
  keyof Omit<ILoginSession, DefaultSchemaFields>,
  object
> = {
  user: { ...RequiredObjectIdType, ref: MODEL_NAMES.USER },
  status: { type: Types.Number, enum: BIT, default: BIT.OFF },
  expiry_date: {
    type: Date,
    default: new Date(Date.now() + Env.JWT_EXPIRY * 1000),
  },
  logged_out_at: { type: Types.Date },
  logged_out: { type: Types.Boolean, default: false },
  expired: { type: Types.Boolean, default: false },
  deactivation_reason: { ...TrimmedString, enum: SessionDeactivationReason },
  os: { ...TrimmedRequiredString },
  version: { ...TrimmedRequiredString },
  device_name: { ...TrimmedRequiredString },
  device_id: { ...TrimmedRequiredString },
  ip: { ...TrimmedRequiredString },
  ip_based_login_location: { ...TrimmedRequiredString },
  ip_based_login_country: { ...TrimmedRequiredString },
  is_mobile: { type: Types.Boolean, required: true },
};

const LoginSessionSchema = createSchema(schemaFields);
const LoginSession = model<ILoginSession>(
  MODEL_NAMES.LOGIN_SESSION,
  LoginSessionSchema,
);

export default LoginSession;
