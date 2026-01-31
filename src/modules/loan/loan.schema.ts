import { model } from "mongoose";
import { ILoan } from "./loan.model";
import MODEL_NAMES from "../../common/model_manifest";
import { Currency } from "../../common/currencies.enum";
import {
  DefaultSchemaFields,
  ObjectIdType,
  RequiredObjectIdType,
  TrimmedRequiredString,
  TrimmedString,
  createSchema,
} from "../../helpers/schema";
import {
  LoanRepaymentType,
  LoanStatus,
  LoanApprovalMethod,
  InstallmentFrequency,
} from "./loan.enum";

const schemaFields: Record<keyof Omit<ILoan, DefaultSchemaFields>, object> = {
  user: { ...RequiredObjectIdType, ref: MODEL_NAMES.USER, index: true },
  principal_amount: { type: Number, required: true },
  interest_rate: { type: Number, required: true, min: 0, max: 100 },
  total_interest: { type: Number, required: true, min: 0 },
  total_repayable_amount: { type: Number, required: true, min: 0 },
  currency: {
    ...TrimmedString,
    enum: Currency,
    default: Currency.NIGERIAN_NAIRA,
  },

  disbursement_date: { type: Date, required: true },
  due_date: { type: Date, required: true },
  repayment_type: { ...TrimmedRequiredString, enum: LoanRepaymentType },
  installment_count: { type: Number, min: 0 },
  installment_frequency: {
    ...TrimmedString,
    enum: InstallmentFrequency,
  },
  late_fee_rate: { type: Number, default: 0, min: 0, max: 100 },
  late_fees_accrued: { type: Number, min: 0 },
  penalty_cap: { type: Number, min: 0 },

  status: { ...TrimmedString, enum: LoanStatus, default: LoanStatus.PENDING },
  is_overdue: { type: Boolean, default: false },
  days_overdue: { type: Number, min: 0 },
  approval_method: {
    ...TrimmedString,
    enum: LoanApprovalMethod,
    default: LoanApprovalMethod.MANUAL,
  },
  approved_by: { ...ObjectIdType, ref: MODEL_NAMES.ADMIN },
  approved_on: { type: Date },
  repayment_completion_date: { type: Date },
};

const LoanSchema = createSchema(schemaFields);
const Loan = model<ILoan>(MODEL_NAMES.LOAN, LoanSchema);

export default Loan;
