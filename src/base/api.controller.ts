import express, { Router } from 'express';
import ResponseHandler from './response.handler';
import RequestUtils from '../common/utils/request_utils';

/**
 * An abstract class that provides a base controller for all API controllers.
 * Controllers that extends this class get access to:
 * - an instance of RequestUtils, AuthMiddleware
 * - Other non private members of the ResponseHandler class
 * - The express router of the request
 * - an abstract method initializeMiddleware that needs to be implemented when initializing middlewares
 * - an abstract method initializeRoutes that needs to be implemented when initializing routes
 */
abstract class ApiController extends ResponseHandler {
  router: Router;
  protected requestUtils: RequestUtils;

  constructor() {
    super();
    this.router = express.Router();
    this.requestUtils = new RequestUtils(this.router);
    this.initializeMiddleware();
    this.initializeRoutes();
  }
  protected abstract initializeMiddleware(): void;
  protected abstract initializeRoutes(): void;
}

export default ApiController;
