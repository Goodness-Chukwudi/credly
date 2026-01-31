import ApiController from "../../base/api.controller";
import { ADMIN_LABEL } from "../../common/constants";
import RequestValidator from "../../common/utils/request_validator";
import { createDbSession } from "../../helpers/db";
import AuthMiddleware from "../authentication/auth/auth.middleware";
import {
  approveUsersLoan,
  getUsersLoanDetails,
  getUsersLoans,
  listUsers,
  verifyNewUser,
} from "./admin.service";

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
    this.listUsers("/users"); //GET
    this.verifyUser("/users/:userId/verify"); //PATCH
    this.listLoans("/loans"); //GET
    this.viewLoanDetails("/loans/:loanId"); //GET
    this.approveLoan("/loans/:loanId/approve"); //PATCH
  }

  listUsers(path: string) {
    this.router.get(path, async (req, res) => {
      try {
        const users = await listUsers(req);

        await this.handleSuccess(res, { users });
      } catch (error) {
        await this.handleError(res, error as Error);
      }
    });
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

  listLoans(path: string) {
    this.router.get(path, async (req, res) => {
      try {
        const loans = await getUsersLoans(req);

        await this.handleSuccess(res, { loans });
      } catch (error) {
        await this.handleError(res, error as Error);
      }
    });
  }

  viewLoanDetails(path: string) {
    this.router.get(path, async (req, res) => {
      try {
        const loan = await getUsersLoanDetails(req.params.loanId as string);

        await this.handleSuccess(res, { loan });
      } catch (error) {
        await this.handleError(res, error as Error);
      }
    });
  }

  approveLoan(path: string) {
    this.router.patch(path, async (req, res) => {
      try {
        const admin = this.requestUtils.getFromState(ADMIN_LABEL);
        const loans = await approveUsersLoan(
          req.params.loanId as string,
          admin.id,
        );

        await this.handleSuccess(res, { loans });
      } catch (error) {
        await this.handleError(res, error as Error);
      }
    });
  }
}

const AdminController = new _AdminController().router;
export default AdminController;
