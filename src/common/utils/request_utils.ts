import { Request, Router, Response } from "express";
import { IUser } from "../../modules/user/user.model";
import { LOGIN_SESSION_LABEL, USER_LABEL } from "../constants";
import { ILoginSession } from "../../modules/authentication/login_session/login_session.model";

class RequestUtils {
  private router: Router;
  private request!: Request;
  private response!: Response;

  constructor(router: Router) {
    this.router = router;
    this.router.use((req, res, next) => {
      this.request = req;
      this.response = res;
      next();
    });
  }

  /**
   * Sets the provided data with the provided key to the response.locals object of the express instance.
   * @param {string} key The key to be used to save the provided data
   * @param {*} data Data of type any, to be saved
   * @returns  void
   */
  addToState(key: string, data: unknown) {
    this.response.locals[key] = data;
  }

  /**
   * fetches the value of the provided key from the response.locals object of express instance.
   * @param {string} key The key to be used to fetch the data
   * @returns {*} The saved data of type any or null
   */
  getFromState(key: string) {
    return this.response.locals[key] || null;
  }

  /**
   * @returns {IUser} an object containing details of the logged in user.
   */
  getUser() {
    return this.response.locals[USER_LABEL] as IUser;
  }

  /**
   * @returns {ILoginSession} an object containing details of the logged in session.
   */
  getLoginSession() {
    return this.response.locals[LOGIN_SESSION_LABEL] as ILoginSession;
  }
}

export default RequestUtils;
