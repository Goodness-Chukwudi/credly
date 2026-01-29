import { model } from "mongoose";
import { PASSWORD_STATUS } from "./password.enum";
import { IPassword } from "./password.model";
import MODEL_NAMES from "../../../common/model_manifest";
import {
  DefaultSchemaFields,
  RequiredEmail,
  RequiredObjectIdType,
  TrimmedRequiredString,
  TrimmedString,
  createSchema,
} from "../../../helpers/schema";

const schemaFields: Record<keyof Omit<IPassword, DefaultSchemaFields>, object> =
  {
    password: { ...TrimmedRequiredString },
    email: { ...RequiredEmail },
    user: { ...RequiredObjectIdType, ref: MODEL_NAMES.USER },
    status: {
      ...TrimmedString,
      enum: PASSWORD_STATUS,
      default: PASSWORD_STATUS.ACTIVE,
    },
  };

const PasswordSchema = createSchema(schemaFields);
const Password = model<IPassword>(MODEL_NAMES.PASSWORD, PasswordSchema);

export default Password;
