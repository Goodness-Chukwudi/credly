import { Document } from "mongoose";
import { DbId, EntityModel } from "../../common/interface";
import { Currency } from "../../common/currencies.enum";
import { IUserDocument, IUser } from "../user/user.model";
import {
  LoanInterestType,
  LoanRepaymentType,
  LoanStatus,
  LoanApprovalMethod,
} from "./loan.enum";
import { IAdmin, IAdminDocument } from "../admin/admin.model";

export interface ILoan extends EntityModel {
  user: DbId | IUserDocument | IUser;
  principal_amount: number;
  interest_rate: number;
  interest_type: LoanInterestType;
  interest_amount: number;
  total_repayable_interest: number;
  currency: Currency;

  disbursement_date: Date;
  due_date: Date;
  repayment_type: LoanRepaymentType;
  installment_count: number;
  installment_frequency: number;
  late_fee_rate: number; // e.g. 0.02 = 2% per period overdue
  late_fees_accrued: number;
  penalty_cap: number; // Max penalty allowed

  status: LoanStatus;
  is_overdue: boolean;
  days_overdue: number;
  approval_method: LoanApprovalMethod;
  approved_by: DbId | IAdminDocument | IAdmin;
  repayment_completion_date: Date;
}

export interface ILoanDocument extends ILoan, Document {
  id: string;
}
