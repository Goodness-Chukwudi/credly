import { RequestLoanDTO } from "./loan.dto";
import { differenceInMonths } from "date-fns";
import loanRepo from "./loan.repo";
import { LoanStatus } from "./loan.enum";
import { BadRequestError, NotFoundError } from "../../helpers/error/app_error";
import {
  generateBadRequestError,
  generateNotFoundError,
} from "../../helpers/error/error_response";
import { INTEREST_RATE } from "../../common/constants";

const requestLoan = async (data: RequestLoanDTO) => {
  const duration = differenceInMonths(new Date(), data.due_date);

  const loadData = {
    ...data,
    interest_rate: INTEREST_RATE,
    total_repayable_interest: data.principal_amount * INTEREST_RATE * duration,
  };

  return await loanRepo.save(loadData);
};

const updateLoanRequest = async (loanId: string, data: RequestLoanDTO) => {
  const loan = await loanRepo.findById(loanId);
  if (!loan) throw new NotFoundError(generateNotFoundError("loan request"));
  if (loan.status !== LoanStatus.PENDING) {
    const error = generateBadRequestError(
      "This loan request is no longer pending",
    );
    throw new BadRequestError(error);
  }

  const duration = differenceInMonths(new Date(), loan.due_date);

  const update = {
    ...data,
    total_repayable_interest: data.principal_amount * INTEREST_RATE * duration,
  };

  return await loanRepo.updateById(loanId, update);
};

const deleteLoanRequest = async (loanId: string) => {
  const loan = await loanRepo.findById(loanId);
  if (!loan) throw new NotFoundError(generateNotFoundError("loan request"));
  if (loan.status !== LoanStatus.PENDING) {
    const error = generateBadRequestError(
      "This loan request is no longer pending",
    );
    throw new BadRequestError(error);
  }

  return await loanRepo.deleteOne({ _id: loanId });
};

const getLoans = async (userId: string, page?: number, limit?: number) => {
  return await loanRepo.paginate({ user: userId }, { page, limit });
};

export { requestLoan, updateLoanRequest, deleteLoanRequest, getLoans };
