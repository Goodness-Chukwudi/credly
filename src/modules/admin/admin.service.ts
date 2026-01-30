import { ClientSession } from "mongoose";
import { COUNTRY } from "../../common/countries.enum";
import logger from "../../common/utils/logger";
import { createDbSession } from "../../helpers/db";
import { hashData } from "../authentication/auth/auth.utils";
import { Gender, UserStatus } from "../user/user.enums";
import { createNewUser } from "../user/user.service";
import { AdminDepartment, AdminTier, AdminType } from "./admin.enum";
import adminRepo from "./admin.repo";
import userRepo from "../user/user.repo";
import { NotFoundError } from "../../helpers/error/app_error";
import { generateNotFoundError } from "../../helpers/error/error_response";
import { WALLET_TYPE } from "../wallet/wallet.enum";
import walletRepo from "../wallet/wallet.repo";

const verifyNewUser = async (userId: string, session: ClientSession) => {
  const user = await userRepo.findOne({ _id: userId, is_verified: false });
  if (!user) throw new NotFoundError(generateNotFoundError("user"));

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

export { createDefaultAdmin, verifyNewUser };
