import { UserStatusResponseDTO } from "../modules/user/user.dto";
import { UserStatus } from "../modules/user/user.enums";

export const USER_LABEL = "user";
export const LOGIN_SESSION_LABEL = "login_session";
export const USER_PASSWORD_LABEL = "user_password";
export const SESSION_ID_LABEL = "session_id";
export const ADMIN_LABEL = "admin";

export const INPUT_VALIDATION_ERROR = "One or more validation errors occurred";
export const ONE_DAY_IN_SECS = 864_00;
export const ONE_DAY_IN_MILLI_SECS = 8640_00_00;
export const THIRTY_DAYS_IN_MILLI_SECS = 8640_00_00 * 30;
export const INTEREST_RATE = 20;

type Status = `${UserStatus}`;
const UserStatusResponse: Partial<Record<Status, UserStatusResponseDTO>> = {
  Suspended: {
    status: UserStatus.SUSPENDED,
    message: "Your account has been suspended",
  },
  Deactivated: {
    status: UserStatus.DEACTIVATED,
    message: "Your account has been deactivated",
  },
  Pending_Deletion: {
    status: UserStatus.PENDING_DELETION,
    message: "You account is about to be permanently deleted!",
  },
};

export default UserStatusResponse;
