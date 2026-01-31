import ApiController from "../../base/api.controller";
import RequestValidator from "../../common/utils/request_validator";
import AuthMiddleware from "../authentication/auth/auth.middleware";
import {
  deleteLoanRequest,
  getLoanDetails,
  getLoans,
  requestLoan,
  updateLoanRequest,
} from "./loan.service";
import { requestLoanValidator } from "./loan.validator";

class _LoanController extends ApiController {
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
    this.requestNewLoan("/"); //POST
    this.listLoans("/"); //GET
    this.getLoanDetails("/:loanId"); //GET
    this.updateLoan("/:loanId"); //PATCH
    this.deleteLoan("/:loanId"); //DELETE
  }

  requestNewLoan(path: string) {
    this.router.post(path, this.validator.validateBody(requestLoanValidator));
    this.router.post(path, async (req, res) => {
      try {
        const user = this.requestUtils.getUser();
        req.body.user = user.id;
        await requestLoan(req.body);
        const message = "Loan request successful";

        await this.handleSuccess(res, { message });
      } catch (error) {
        await this.handleError(res, error as Error);
      }
    });
  }

  updateLoan(path: string) {
    this.router.patch(path, this.validator.validateBody(requestLoanValidator));
    this.router.patch(path, async (req, res) => {
      try {
        const user = this.requestUtils.getUser();
        req.body.user = user.id;
        await updateLoanRequest(req.params.loanId as string, req.body);
        const message = "Loan details updated successfully";

        await this.handleSuccess(res, { message });
      } catch (error) {
        await this.handleError(res, error as Error);
      }
    });
  }

  listLoans(path: string) {
    this.router.get(path, async (req, res) => {
      try {
        const user = this.requestUtils.getUser();
        const loans = await getLoans(user.id, req);

        await this.handleSuccess(res, { loans });
      } catch (error) {
        await this.handleError(res, error as Error);
      }
    });
  }

  getLoanDetails(path: string) {
    this.router.get(path, async (req, res) => {
      try {
        const user = this.requestUtils.getUser();
        const loan = await getLoanDetails(req.params.loanId as string, user.id);

        await this.handleSuccess(res, { loan });
      } catch (error) {
        await this.handleError(res, error as Error);
      }
    });
  }

  deleteLoan(path: string) {
    this.router.delete(path, async (req, res) => {
      try {
        const user = this.requestUtils.getUser();
        await deleteLoanRequest(req.params.loanId as string, user.id);
        const message = "Loan request deleted successfully";

        await this.handleSuccess(res, { message });
      } catch (error) {
        await this.handleError(res, error as Error);
      }
    });
  }
}

const LoanController = new _LoanController().router;
export default LoanController;
