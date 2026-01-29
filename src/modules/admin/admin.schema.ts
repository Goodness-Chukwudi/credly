import { model, Schema } from 'mongoose';
import MODEL_NAMES from '../../common/model_manifest';
import { TrimmedString, DefaultSchemaFields, TrimmedRequiredString, UniqueRequiredEmail, createSchema } from '../../helpers/schema';
import { IAdmin } from './admin.model';
import { AdminDepartment, AdminTier } from './admin.enum';
import { Gender, UserStatus } from '../user/user.enums';

const Types = Schema.Types;

const schemaFields: Record<keyof Omit<IAdmin, 'full_name' | DefaultSchemaFields>, object> = {
  first_name: { ...TrimmedRequiredString },
  last_name: { ...TrimmedRequiredString },
  middle_name: { ...TrimmedString },
  gender: { ...TrimmedString, enum: Gender },
  dob: { type: Types.Date, required: true, min: new Date(Date.now()) },
  email: { ...UniqueRequiredEmail },
  phone: { ...TrimmedString },
  department: { ...TrimmedRequiredString, enum: AdminDepartment },
  tier: { ...TrimmedRequiredString, enum: AdminTier, default: AdminTier.ONE },
  status: { ...TrimmedString, enum: UserStatus, default: UserStatus.PENDING },
};

const AdminSchema = createSchema(schemaFields);

AdminSchema.virtual('full_name').get(function () {
  if (this.middle_name) return `${this.first_name} ${this.middle_name} ${this.last_name}`;
  return `${this.first_name} ${this.last_name}`;
});

const Admin = model<IAdmin>(MODEL_NAMES.ADMIN, AdminSchema);

export default Admin;
