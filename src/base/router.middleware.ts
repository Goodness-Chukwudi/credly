import { Router } from 'express';
import ResponseHandler from './response.handler';
import RequestUtils from '../common/utils/request_utils';

/**
 * An abstract class that provides a base middleware for all routers.
 * Middleware classes that extend this class get access to:
 * - an instance of RequestUtils
 * - Other non private members of the ResponseHandler class
 * - The express router of the request
 */
abstract class RouterMiddleware extends ResponseHandler {
  public router: Router;
  protected requestUtils: RequestUtils;

  constructor(appRouter: Router) {
    super();
    this.router = appRouter;
    this.requestUtils = new RequestUtils(this.router);
  }
}

export default RouterMiddleware;
