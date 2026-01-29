import { COUNTRY } from '../../common/countries.enum';
import { Gender, UserStatus } from './user.enums';
import { IUser } from './user.model';

interface CreateUserDTO {
  first_name: string;
  last_name: string;
  middle_name?: string;
  gender: Gender;
  dob: Date,
  email: string;
  phone: string;
  address: string;
  country: COUNTRY;
  password: string;
}

interface UserStatusResponseDTO {
  status: UserStatus;
  message: string;
}

export const loggedInUserFields: (keyof Partial<IUser>)[] = [
  'first_name',
  'last_name',
  'middle_name',
  'full_name',
  'gender',
  'dob',
  'email',
  'phone',
  'address',
  'is_verified',
  'country',
  'status',
  'id',
  'created_at',
];

export type { CreateUserDTO, UserStatusResponseDTO };
