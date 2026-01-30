import ApiController from "../../base/api.controller";
import RequestValidator from "../../common/utils/request_validator";
import { createDbSession } from "../../helpers/db";
import AuthMiddleware from "../authentication/auth/auth.middleware";
import { verifyNewUser } from "./admin.service";

class _AdminController extends ApiController {
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
    this.verifyUser("/verifications/users/:userId"); //PATCH
  }

  verifyUser(path: string) {
    this.router.patch(path, async (req, res) => {
      const session = await createDbSession();
      try {
        await verifyNewUser(req.params.userId as string, session);
        const message = "User verification successful";

        await this.handleSuccess(res, { message }, 200, session);
      } catch (error) {
        await this.handleError(res, error as Error, null, session);
      }
    });
  }
}

const AdminController = new _AdminController().router;
export default AdminController;
