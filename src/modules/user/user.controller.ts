import ApiController from "../../base/api.controller";
import RequestValidator from "../../common/utils/request_validator";
import AuthMiddleware from "../authentication/auth/auth.middleware";
import { logoutUser } from "../authentication/auth/auth.service";
import { SessionDeactivationReason } from "../authentication/login_session/login_session.enum";
import { WALLET_STATUS } from "../wallet/wallet.enum";
import walletRepo from "../wallet/wallet.repo";

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
    this.me("/me"); //Get
    this.logout("/logout"); //Patch
  }

  me(path: string) {
    this.router.get(path, async (req, res) => {
      try {
        const user = this.requestUtils.getUser();
        const wallet = await walletRepo.findOne({
          user: user.id,
          status: { $ne: WALLET_STATUS.CLOSED },
        });

        await this.handleSuccess(res, { user, wallet });
      } catch (error) {
        await this.handleError(res, error as Error);
      }
    });
  }

  logout(path: string) {
    this.router.patch(path, async (req, res) => {
      try {
        const currentSession = this.requestUtils.getLoginSession();
        await logoutUser(
          currentSession,
          SessionDeactivationReason.USER_LOG_OUT,
        );

        await this.handleSuccess(res);
      } catch (error) {
        await this.handleError(res, error as Error);
      }
    });
  }
}

const UserController = new _UserController().router;
export default UserController;
