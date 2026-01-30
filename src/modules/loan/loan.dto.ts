import { LoanRepaymentType, InstallmentFrequency } from "./loan.enum";

interface RequestLoanDTO {
  user: string;
  principal_amount: number;
  repayment_type: LoanRepaymentType;
  installment_count: number;
  installment_frequency: InstallmentFrequency;
  due_date: Date;
}

export { RequestLoanDTO };
