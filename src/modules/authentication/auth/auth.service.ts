import { ClientSession } from "mongoose";
import UserStatusResponse from "../../../common/constants";
import {
  UnauthorizedError,
  BadRequestError,
  ForbiddenError,
} from "../../../helpers/error/app_error";
import {
  SESSION_EXPIRED,
  INVALID_LOGIN,
  INACTIVE_ACCOUNT,
} from "../../../helpers/error/error_response";
import { UserStatus } from "../../user/user.enums";
import { IUser } from "../../user/user.model";
import {
  BIT,
  SessionDeactivationReason,
} from "../login_session/login_session.enum";
import { ILoginSession } from "../login_session/login_session.model";
import loginSessionRepo from "../login_session/login_session.repo";
import { generateAccessToken } from "./auth.utils";
import walletRepo from "../../wallet/wallet.repo";
import { WALLET_STATUS } from "../../wallet/wallet.enum";

const loginUser = async (user: IUser, session?: ClientSession) => {
  const activeSession = await loginSessionRepo.findOne({
    status: BIT.ON,
    user: user.id,
  });

  if (activeSession)
    await logoutUser(
      activeSession,
      SessionDeactivationReason.USER_LOGIN,
      session,
    );

  const loginSessionData = {
    user: user.id,
    status: BIT.ON,
    os: "Mac OS", //Actual data will be used to track these hardcoded details
    version: "12.45",
    device_name: "Windows",
    device_id: "0923uhr3tg324de723ibd87we",
    ip: "192.198.23.45",
    ip_based_login_location: "Lagos, Nigeria",
    ip_based_login_country: "Nigeria",
    is_mobile: true,
  };

  const loginSession = await loginSessionRepo.save(loginSessionData, {
    session,
  });

  const tokenPayload = {
    user_id: user.id,
    name: user.full_name!,
    gender: user.gender,
    login_session_id: loginSession.id,
  };

  return generateAccessToken(tokenPayload);
};

const validateLoginSessionExpiry = async (
  loginSession: ILoginSession,
  session?: ClientSession,
) => {
  if (loginSession.expiry_date > new Date()) return;

  const update = {
    expired: true,
    status: BIT.OFF,
    deactivation_reason: SessionDeactivationReason.SESSION_EXPIRY,
  };
  await loginSessionRepo.updateById(loginSession.id, update, { session });

  throw new UnauthorizedError(SESSION_EXPIRED);
};

const logoutUser = async (
  userSession: ILoginSession,
  reason: SessionDeactivationReason,
  session?: ClientSession,
): Promise<ILoginSession> => {
  const update: Partial<ILoginSession> = {
    status: BIT.OFF,
    deactivation_reason: reason,
  };

  if (userSession.expiry_date > new Date()) {
    update.logged_out = true;
    update.logged_out_at = new Date();
  } else {
    update.expired = true;
  }

  userSession = await loginSessionRepo.updateById(userSession.id, update, {
    session,
  });

  return userSession;
};

const validateUserStatus = (user: IUser) => {
  if (user.status === UserStatus.DELETED)
    throw new BadRequestError(INVALID_LOGIN);

  if (user.status != UserStatus.ACTIVE) {
    const statusResponse = UserStatusResponse[user.status];
    throw new ForbiddenError(INACTIVE_ACCOUNT, statusResponse);
  }
};

const setLoginResponse = async (
  user: IUser,
  token: string,
  message: string,
) => {
  const wallet = await walletRepo.findOne({
    user: user.id,
    status: { $ne: WALLET_STATUS.CLOSED },
  });

  const response = {
    message,
    user,
    wallet,
    access_token: token,
  };

  return response;
};

export {
  loginUser,
  logoutUser,
  validateUserStatus,
  setLoginResponse,
  validateLoginSessionExpiry,
};
