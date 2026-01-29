import ApiController from "../../../base/api.controller";
import RequestValidator from "../../../common/utils/request_validator";
import { createDbSession } from "../../../helpers/db";
import { CreateUserDTO } from "../../user/user.dto";
import { createNewUser } from "../../user/user.service";
import AuthMiddleware from "./auth.middleware";
import { loginUser, setLoginResponse } from "./auth.service";
import { hashData } from "./auth.utils";
import { signUp, login } from "./auth.validator";


class _AuthController extends ApiController {
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
    this.signup('/signup'); //POST
    this.login('/login'); //POST
  }

  signup(path: string) {
    this.router.post(path, this.validator.validateBody(signUp));

    this.router.post(path, async (req, res) => {
      const session = await createDbSession();
      try {
        const { confirm_password, ...rest } = req.body;
        const userData: CreateUserDTO = {
          ...rest,
          password: await hashData(req.body.password),
        };

        const user = await createNewUser(userData, session);
        const message = 'Your account has been created and is pending approval';

        await this.handleSuccess(res, { message, user }, 201, session);
      } catch (error) {
       await this.handleError(res, error as Error, null, session);
      }
    });
  }

  login(path: string) {
    this.router.post(
      path,
      this.validator.validateBody(login),
      this.authMiddleware.loadUserAndPasswordToRequestByEmail,
      this.authMiddleware.validatePassword
    );

    this.router.post(path, async (req, res) => {
      try {
        const user = this.requestUtils.getUser();
        const token = await loginUser(user);
        const response = setLoginResponse(user, token, 'Login successful!');

        await this.handleSuccess(res, response);
      } catch (error) {
        await this.handleError(res, error as Error);
      }
    });
  }
}

const AuthController = new _AuthController().router;
export default AuthController;
