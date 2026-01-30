import { Express } from "express";
import AuthMiddleware from "../modules/authentication/auth/auth.middleware";
import Env from "../common/config/environment_variables";
import AdminController from "../modules/admin/admin.controller";

class AdminRoute {
  private app: Express;
  private authMiddleware: AuthMiddleware;

  constructor(app: Express) {
    this.app = app;
    this.authMiddleware = new AuthMiddleware(this.app);
  }

  initializeRoutes() {
    const BASE_ROUTE = Env.API_PATH;

    this.app.use(
      BASE_ROUTE,
      this.authMiddleware.authGuard,
      this.authMiddleware.adminGuard,
    );

    this.app.use(BASE_ROUTE + "/admin", AdminController);
  }
}

export default AdminRoute;
