import { Request } from "express";
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
import { FilterQuery } from "mongoose";
import { ILoan } from "./loan.model";

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
  const loan = await loanRepo.findOne({ _id: loanId, user: data.user });
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

  return await loanRepo.paginate(query, { page, limit });
};

export { requestLoan, updateLoanRequest, deleteLoanRequest, getLoans };
