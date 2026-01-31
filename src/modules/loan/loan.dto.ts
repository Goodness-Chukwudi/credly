import { LoanRepaymentType, InstallmentFrequency } from "./loan.enum";

interface RequestLoanDTO {
  user: string;
  principal_amount: number;
  repayment_type: LoanRepaymentType;
  installment_frequency: InstallmentFrequency;
  disbursement_date: Date;
  due_date: Date;
}

export { RequestLoanDTO };
