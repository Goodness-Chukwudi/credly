import { Express } from "express";
import AuthMiddleware from "../modules/authentication/auth/auth.middleware";
import UserController from "../modules/user/user.controller";
import Env from "../common/config/environment_variables";
import AuthController from "../modules/authentication/auth/auth.controller";
import LoanController from "../modules/loan/loan.controller";

class AppRoute {
  private app: Express;
  private authMiddleware: AuthMiddleware;

  constructor(app: Express) {
    this.app = app;
    this.authMiddleware = new AuthMiddleware(this.app);
  }

  initializeRoutes() {
    const BASE_ROUTE = Env.API_PATH;

    this.app.use(BASE_ROUTE + "/auth", AuthController);

    this.app.use(BASE_ROUTE, this.authMiddleware.authGuard); //Load authentication middleWare. Routes after this are protected

    this.app.use(BASE_ROUTE + "/users", UserController);
    this.app.use(BASE_ROUTE + "/loans", LoanController);
  }
}

export default AppRoute;
