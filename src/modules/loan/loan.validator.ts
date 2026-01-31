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
import { startOfDay, endOfDay } from "date-fns";

const requestLoanValidator = Joi.object({
  principal_amount: validRequiredNumber.min(0),
  repayment_type: validRequiredString.valid(
    ...Object.values(LoanRepaymentType),
  ),
  installment_frequency: validString
    .valid(...Object.values(InstallmentFrequency))
    .when("repayment_type", {
      is: LoanRepaymentType.INSTALLMENTS,
      then: validRequiredString.valid(...Object.values(InstallmentFrequency)),
      otherwise: validString.strip(),
    }),
  disbursement_date: formattableRequiredDate.min(startOfDay(new Date())),
  due_date: formattableRequiredDate.min(endOfDay(new Date())),
});

const updateLoanValidator = Joi.object({
  principal_amount: validNumber.min(0),
  repayment_type: validString.valid(...Object.values(LoanRepaymentType)),
  installment_frequency: validString.valid(
    ...Object.values(InstallmentFrequency),
  ),
  disbursement_date: formattableDate.min(startOfDay(new Date())),
  due_date: formattableDate.min(endOfDay(new Date())),
});

export { requestLoanValidator, updateLoanValidator };
