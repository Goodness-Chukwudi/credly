import ApiController from "../../base/api.controller";
import { mapTo } from "../../common/utils/app_utils";
import RequestValidator from "../../common/utils/request_validator";
import AuthMiddleware from "../authentication/auth/auth.middleware";
import { logoutUser } from "../authentication/auth/auth.service";
import { SessionDeactivationReason } from "../authentication/login_session/login_session.enum";
import { loggedInUserFields } from "./user.dto";
import { IUser } from "./user.model";


class _UserController extends ApiController {
  validator!: RequestValidator;
  authMiddleware!: AuthMiddleware;

  constructor() {
    super();
  }

  protected initializeMiddleware() {
    this.validator = new RequestValidator(this.router);
    this.authMiddleware = new AuthMiddleware(this.router);
  }

  protected initializeRoutes() {
    this.me('/me'); //Get
    this.logout('/logout'); //Patch
  }

  me(path: string) {
    this.router.get(path, async (req, res) => {
      try {
        let user = this.requestUtils.getUser();

        user = mapTo<IUser>(user, loggedInUserFields);

        await this.handleSuccess(res, user);
      } catch (error) {
        await this.handleError(res, error as Error);
      }
    });
  }

    logout(path: string) {
      this.router.patch(path, async (req, res) => {
        try {
          const currentSession = this.requestUtils.getLoginSession();
          await logoutUser(currentSession, SessionDeactivationReason.USER_LOG_OUT);

          await this.handleSuccess(res);
        } catch (error) {
          await this.handleError(res, error as Error);
        }
      });
    }
}

const UserController = new _UserController().router;
export default UserController;
