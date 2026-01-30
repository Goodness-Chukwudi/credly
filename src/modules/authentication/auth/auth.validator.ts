import Joi from "joi";
import {
  validRequiredString,
  validRequiredEmail,
  validPassword,
  validConfirmPassword,
  validString,
  formattableRequiredDate,
} from "../../../common/utils/request_validator";
import { Gender } from "../../user/user.enums";
import { COUNTRY } from "../../../common/countries.enum";

const signUp = Joi.object({
  first_name: validRequiredString,
  last_name: validRequiredString,
  middle_name: validString,
  gender: validRequiredString.valid(...Object.values(Gender)),
  dob: formattableRequiredDate.max(new Date()),
  phone: validRequiredString,
  address: validRequiredString,
  country: validRequiredString.valid(...Object.values(COUNTRY)),
  email: validRequiredEmail,
  password: validPassword,
  confirm_password: validConfirmPassword,
});

const login = Joi.object({
  email: validRequiredEmail,
  password: validRequiredString,
});

export { signUp, login };
