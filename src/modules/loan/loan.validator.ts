import Joi from "joi";
import {
  formattableDate,
  validString,
  formattableRequiredDate,
  validNumber,
  validRequiredNumber,
  validRequiredString,
} from "../../common/utils/request_validator";
import { InstallmentFrequency, LoanRepaymentType } from "./loan.enum";

const requestLoanValidator = Joi.object({
  principal_amount: validRequiredNumber.min(0),
  repayment_type: validRequiredString.valid(
    ...Object.values(LoanRepaymentType),
  ),
  installment_count: validRequiredNumber.min(0),
  installment_frequency: validRequiredString.valid(
    ...Object.values(InstallmentFrequency),
  ),
  due_date: formattableRequiredDate.max(new Date()),
});

const updateLoanValidator = Joi.object({
  principal_amount: validNumber.min(0),
  repayment_type: validString.valid(...Object.values(LoanRepaymentType)),
  installment_count: validNumber.min(0),
  installment_frequency: validString.valid(
    ...Object.values(InstallmentFrequency),
  ),
  due_date: formattableDate.max(new Date()),
});

export { requestLoanValidator, updateLoanValidator };
