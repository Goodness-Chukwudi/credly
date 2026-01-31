import { Request } from "express";
import { RequestLoanDTO } from "./loan.dto";
import { differenceInMonths } from "date-fns";
import loanRepo from "./loan.repo";
import {
  InstallmentFrequency,
  LoanRepaymentType,
  LoanStatus,
} from "./loan.enum";
import { BadRequestError, NotFoundError } from "../../helpers/error/app_error";
import {
  generateBadRequestError,
  generateNotFoundError,
} from "../../helpers/error/error_response";
import { INTEREST_RATE } from "../../common/constants";
import { FilterQuery } from "mongoose";
import { ILoan } from "./loan.model";
import { startOfDay, endOfDay } from "date-fns";

const requestLoan = async (data: RequestLoanDTO) => {
  const dueDate = endOfDay(new Date(data.due_date));
  const disbursementDate = startOfDay(new Date(data.disbursement_date));
  const duration = differenceInMonths(dueDate, disbursementDate);

  const installmentsCount = getInstallmentCount(
    duration,
    data.repayment_type,
    data.installment_frequency,
  );

  const totalRepayableAmount = data.principal_amount * INTEREST_RATE * duration;
  const loadData = {
    ...data,
    interest_rate: INTEREST_RATE,
    installment_count: installmentsCount,
    total_interest: totalRepayableAmount - data.principal_amount,
    total_repayable_amount: totalRepayableAmount,
  };

  return await loanRepo.save(loadData);
};

const updateLoanRequest = async (loanId: string, data: RequestLoanDTO) => {
  const loan = await loanRepo.findOne({ _id: loanId, user: data.user });
  if (!loan) throw new NotFoundError(generateNotFoundError("loan request"));
  if (loan.status !== LoanStatus.PENDING) {
    const error = generateBadRequestError(
      "This loan request is no longer pending",
    );
    throw new BadRequestError(error);
  }

  const disbursementDate = data.disbursement_date || loan.disbursement_date;
  const dueDate = data.due_date || loan.due_date;

  const duration = differenceInMonths(
    endOfDay(new Date(dueDate)),
    startOfDay(new Date(disbursementDate)),
  );
  const frequency = data.installment_frequency ?? loan.installment_frequency;
  const repaymentType = data.repayment_type ?? loan.repayment_type;
  const installmentsCount = getInstallmentCount(
    duration,
    repaymentType,
    frequency,
  );

  const totalRepayableAmount = data.principal_amount * INTEREST_RATE * duration;
  const update = {
    ...data,
    installment_count: installmentsCount,
    total_interest: totalRepayableAmount - data.principal_amount,
    total_repayable_amount: totalRepayableAmount,
  };

  return await loanRepo.updateOne({ _id: loanId, user: data.user }, update);
};

const deleteLoanRequest = async (loanId: string, user: string) => {
  const loan = await loanRepo.findOne({ _id: loanId, user });
  if (!loan) throw new NotFoundError(generateNotFoundError("loan request"));
  if (loan.status !== LoanStatus.PENDING) {
    const error = generateBadRequestError(
      "This loan request is no longer pending",
    );
    throw new BadRequestError(error);
  }

  return await loanRepo.deleteOne({ _id: loanId });
};

const getLoans = async (userId: string, req: Request) => {
  const query: FilterQuery<ILoan> = { user: userId };
  if (req.query.status) query.status = req.query.status;

  let page, limit;
  if (req.query.page) page = Number(req.query.page);
  if (req.query.limit) limit = Number(req.query.limit);
  const select =
    "principal_amount interest_rate total_interest total_repayable_amount currency status created_at";

  return await loanRepo.paginate(query, { page, limit, select });
};

const getLoanDetails = async (loanId: string, userId: string) => {
  const select = "-updated_at -is_deleted -approval_method -approved_by";
  return await loanRepo.findOne({ _id: loanId, user: userId }, { select });
};

function getInstallmentCount(
  duration: number,
  repaymentType: LoanRepaymentType,
  frequency: InstallmentFrequency,
) {
  if (repaymentType === LoanRepaymentType.SINGLE) return 0;

  if (frequency === InstallmentFrequency.WEEKLY) {
    return duration * 4;
  }

  if (frequency === InstallmentFrequency.BI_WEEKLY) {
    return duration * 2;
  }

  if (frequency === InstallmentFrequency.MONTHLY) {
    return duration;
  }
}

export {
  requestLoan,
  updateLoanRequest,
  deleteLoanRequest,
  getLoans,
  getLoanDetails,
};
