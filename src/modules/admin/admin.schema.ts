import { model } from "mongoose";
import MODEL_NAMES from "../../common/model_manifest";
import {
  DefaultSchemaFields,
  TrimmedRequiredString,
  createSchema,
  RequiredObjectIdType,
} from "../../helpers/schema";
import { IAdmin } from "./admin.model";
import { AdminDepartment, AdminTier, AdminType } from "./admin.enum";

const schemaFields: Record<
  keyof Omit<IAdmin, "full_name" | DefaultSchemaFields>,
  object
> = {
  user: { ...RequiredObjectIdType, ref: MODEL_NAMES.USER },
  department: { ...TrimmedRequiredString, enum: AdminDepartment },
  tier: { ...TrimmedRequiredString, enum: AdminTier, default: AdminTier.ONE },
  type: { ...TrimmedRequiredString, enum: AdminType, default: AdminType.ADMIN },
  is_active: { type: Boolean, default: false },
};

const AdminSchema = createSchema(schemaFields);

AdminSchema.virtual("full_name").get(function () {
  if (this.middle_name)
    return `${this.first_name} ${this.middle_name} ${this.last_name}`;
  return `${this.first_name} ${this.last_name}`;
});

const Admin = model<IAdmin>(MODEL_NAMES.ADMIN, AdminSchema);

export default Admin;
