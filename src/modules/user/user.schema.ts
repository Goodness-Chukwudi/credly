import { model, Schema } from 'mongoose';
import { IUser } from './user.model';
import { Gender, UserStatus } from './user.enums';
import { COUNTRY } from '../../common/countries.enum';
import MODEL_NAMES from '../../common/model_manifest';
import { TrimmedString, DefaultSchemaFields, TrimmedRequiredString, UniqueRequiredEmail, createSchema } from '../../helpers/schema';

const Types = Schema.Types;

const schemaFields: Record<keyof Omit<IUser, 'full_name' | DefaultSchemaFields>, object> = {
  first_name: { ...TrimmedRequiredString },
  last_name: { ...TrimmedRequiredString },
  middle_name: { ...TrimmedString },
  gender: { ...TrimmedString, enum: Gender },
  dob: { type: Types.Date, required: true, min: new Date(Date.now()) },
  email: { ...UniqueRequiredEmail },
  phone: { ...TrimmedString },
  address: { ...{ ...TrimmedRequiredString }, },
  country: { ...TrimmedString, enum: COUNTRY },
  status: { ...TrimmedString, enum: UserStatus, default: UserStatus.PENDING },
  is_verified: { type: Types.Boolean, default: false },
};

const UserSchema = createSchema(schemaFields);

UserSchema.virtual('full_name').get(function () {
  if (this.middle_name) return `${this.first_name} ${this.middle_name} ${this.last_name}`;
  return `${this.first_name} ${this.last_name}`;
});

const User = model<IUser>(MODEL_NAMES.USER, UserSchema);

export default User;
