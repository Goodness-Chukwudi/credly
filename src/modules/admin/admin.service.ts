import { Request } from "express";
import { ClientSession, FilterQuery } from "mongoose";
import { COUNTRY } from "../../common/countries.enum";
import logger from "../../common/utils/logger";
import { createDbSession } from "../../helpers/db";
import { hashData } from "../authentication/auth/auth.utils";
import { Gender, UserStatus } from "../user/user.enums";
import { createNewUser } from "../user/user.service";
import { AdminDepartment, AdminTier, AdminType } from "./admin.enum";
import adminRepo from "./admin.repo";
import userRepo from "../user/user.repo";
import { BadRequestError, NotFoundError } from "../../helpers/error/app_error";
import {
  generateBadRequestError,
  generateNotFoundError,
} from "../../helpers/error/error_response";
import { WALLET_TYPE } from "../wallet/wallet.enum";
import walletRepo from "../wallet/wallet.repo";
import { differenceInMonths } from "date-fns";
import { LoanStatus } from "../loan/loan.enum";
import loanRepo from "../loan/loan.repo";
import { ILoan } from "../loan/loan.model";

const listUsers = async (req: Request) => {
  const query: FilterQuery<ILoan> = {};
  if (req.query.status) query.status = req.query.status;

  let page, limit;
  if (req.query.page) page = Number(req.query.page);
  if (req.query.limit) limit = Number(req.query.limit);

  return await userRepo.paginate(query, { page, limit });
};

const verifyNewUser = async (userId: string, session: ClientSession) => {
  const user = await userRepo.findOne({ _id: userId });
  if (!user) throw new NotFoundError(generateNotFoundError("user"));

  if (user.is_verified) {
    const error = generateBadRequestError("This user is already verified");
    throw new BadRequestError(error);
  }

  const update = {
    is_verified: true,
    status: UserStatus.ACTIVE, // This should happen after email verification normally
  };

  await userRepo.updateById(user.id, update, { session });

  //create wallet for the user after verification
  await walletRepo.save(
    {
      user: user.id,
      type: WALLET_TYPE.INDIVIDUAL,
    },
    { session },
  );
};

const createDefaultAdmin = async () => {
  const session = await createDbSession();
  try {
    const existingSuperAdmin = await adminRepo.findOne({
      type: AdminType.SUPER_ADMIN,
      status: { $ne: UserStatus.DELETED },
    });

    if (existingSuperAdmin) return;

    const userData = {
      first_name: "Super",
      last_name: "Admin",
      gender: Gender.MALE,
      dob: new Date("1913-01-29"),
      email: "admin@gmail.com",
      phone: "080568725533",
      address: "address",
      country: COUNTRY.NIGERIA,
      password: await hashData("@Password1"),
      status: UserStatus.ACTIVE,
      is_verified: true,
    };

    const user = await createNewUser(userData, session);

    const adminData = {
      user: user.id,
      department: AdminDepartment.ENGINEERING,
      tier: AdminTier.ONE,
      type: AdminType.SUPER_ADMIN,
      is_active: true,
    };

    await adminRepo.save(adminData, { session });

    await session.commitTransaction();
  } catch (error) {
    logger.error(error as Error);
    await session.abortTransaction();
  }
};

const getUsersLoans = async (req: Request) => {
  const query: FilterQuery<ILoan> = {};
  if (req.query.status) query.status = req.query.status;
  if (req.query.user) query.user = req.query.user;

  let page, limit;
  if (req.query.page) page = Number(req.query.page);
  if (req.query.limit) limit = Number(req.query.limit);

  return await loanRepo.paginate(query, { page, limit });
};

const getUsersLoanDetails = async (loanId: string) => {
  return await loanRepo.findById(loanId, { populate: ["user"] });
};

const approveUsersLoan = async (loanId: string, adminId: string) => {
  const loan = await loanRepo.findOne({
    _id: loanId,
    status: LoanStatus.PENDING,
  });

  if (!loan) throw new NotFoundError(generateNotFoundError("loan request"));

  const now = new Date();
  const duration = differenceInMonths(now, loan.due_date);
  const update = {
    status: LoanStatus.ACTIVE,
    total_repayable_interest:
      loan.principal_amount * loan.interest_rate * duration,
    approved_by: adminId,
    approved_on: new Date(),
  };

  return await loanRepo.updateById(loan.id, update);
};

export {
  createDefaultAdmin,
  verifyNewUser,
  getUsersLoans,
  approveUsersLoan,
  getUsersLoanDetails,
  listUsers,
};
