import { Router, NextFunction, Request, Response } from "express";
import { VerifyErrors, TokenExpiredError } from "jsonwebtoken";
import RouterMiddleware from "../../../base/router.middleware";
import {
  USER_LABEL,
  USER_PASSWORD_LABEL,
  LOGIN_SESSION_LABEL,
} from "../../../common/constants";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../../../helpers/error/app_error";
import {
  EMAIL_REQUIRED,
  INVALID_LOGIN,
  generateNotFoundError,
  INVALID_AUTHENTICATION,
  SESSION_EXPIRED,
  INVALID_USER_SESSION,
} from "../../../helpers/error/error_response";
import { IUser } from "../../user/user.model";
import userRepo from "../../user/user.repo";
import { BIT } from "../login_session/login_session.enum";
import loginSessionRepo from "../login_session/login_session.repo";
import { PASSWORD_STATUS } from "../password/password.enum";
import passwordRepo from "../password/password.repo";
import { AccessTokenPayload } from "./auth.dto";
import { validateUserStatus, validateLoginSessionExpiry } from "./auth.service";
import {
  validateHashedData,
  getTokenFromRequest,
  verifyAccessToken,
} from "./auth.utils";

class AuthMiddleware extends RouterMiddleware {
  constructor(appRouter: Router) {
    super(appRouter);
  }

  /**
   * A middleware that fetches a user and his password from the db using the email provided in the request.
   */
  loadUserAndPasswordToRequestByEmail = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const email = req.body.email;
      if (!email) throw new BadRequestError(EMAIL_REQUIRED);

      const userPassword = await passwordRepo.findOne(
        { status: PASSWORD_STATUS.ACTIVE, email },
        { populate: ["user"] },
      );

      if (!userPassword || !userPassword.user)
        throw new BadRequestError(INVALID_LOGIN);

      validateUserStatus(userPassword.user as IUser);
      this.requestUtils.addToState(USER_LABEL, userPassword.user);
      this.requestUtils.addToState(USER_PASSWORD_LABEL, userPassword);
      next();
    } catch (error) {
      return await this.handleError(res, error as Error);
    }
  };

  /**
   * A middleware that fetches a user from the db using the email provided in the request.
   * - The fetched user is available through the getFromState or getRequestUser method of the request service
   */
  loadUserToRequestByEmail = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const email = req.body.email;
      if (!email) throw new BadRequestError(EMAIL_REQUIRED);

      const user = await userRepo.findOne({ email: email });
      if (!user) throw new NotFoundError(generateNotFoundError("user"));

      validateUserStatus(user);

      this.requestUtils.addToState(USER_LABEL, user);
      next();
    } catch (error) {
      return await this.handleError(res, error as Error);
    }
  };

  /**
   * Validates a user's password.
   * Returns an invalid login error response for invalid password
   */
  validatePassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = this.requestUtils.getUser();
      let userPassword = this.requestUtils.getFromState(USER_PASSWORD_LABEL);
      if (!userPassword) {
        userPassword = await passwordRepo.findOne({
          status: PASSWORD_STATUS.ACTIVE,
          email: user.email,
        });
        this.requestUtils.addToState(USER_PASSWORD_LABEL, userPassword);
      }

      const isCorrectPassword = await validateHashedData(
        req.body.password,
        userPassword.password,
      );
      if (!isCorrectPassword) throw new BadRequestError(INVALID_LOGIN);

      next();
    } catch (error) {
      return await this.handleError(res, error as Error);
    }
  };

  authGuard = async (req: Request, res: Response, next: NextFunction) => {
    const token = getTokenFromRequest(req);

    if (!token) {
      const error = new UnauthorizedError(INVALID_AUTHENTICATION);
      return await this.handleError(res, error);
    }

    await verifyAccessToken(token, this.verifyTokenCallback(req, res, next));
  };

  private verifyTokenCallback = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    return async (error: VerifyErrors | null, decoded?: AccessTokenPayload) => {
      try {
        if (error) {
          if (error instanceof TokenExpiredError)
            throw new UnauthorizedError(SESSION_EXPIRED);
          throw new UnauthorizedError(INVALID_AUTHENTICATION);
        }

        const activeSession = await loginSessionRepo.findOne(
          { _id: decoded?.login_session_id, status: BIT.ON },
          {
            populate: ["user"],
          },
        );

        if (!activeSession || !activeSession.user)
          throw new UnauthorizedError(INVALID_USER_SESSION);

        const user = activeSession.user as IUser;
        await validateLoginSessionExpiry(activeSession);
        validateUserStatus(user);

        this.requestUtils.addToState(USER_LABEL, user);
        this.requestUtils.addToState(LOGIN_SESSION_LABEL, activeSession);

        next();
      } catch (error) {
        await this.handleError(res, error as Error);
      }
    };
  };
}

export default AuthMiddleware;
