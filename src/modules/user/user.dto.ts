import { COUNTRY } from "../../common/countries.enum";
import { Gender, UserStatus } from "./user.enums";

interface CreateUserDTO {
  first_name: string;
  last_name: string;
  middle_name?: string;
  gender: Gender;
  dob: Date;
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

export type { CreateUserDTO, UserStatusResponseDTO };
