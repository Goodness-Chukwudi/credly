import express, { Express } from "express";
import compression from "compression";
import helmet from "helmet";
import responseTime from "response-time";
import Env from "./common/config/environment_variables";
import { recordResponseTime } from "./common/utils/app_utils";
import corsSettings from "./common/utils/cors";
import AppRoute from "./routes/app_routes";

class App {
  public app: Express;

  constructor() {
    this.app = express();
    this.plugInMiddlewares();
    this.plugInRoutes();
  }

  private plugInMiddlewares() {
    this.app.use(express.json({ limit: "1mb" }));
    this.app.use(
      express.urlencoded({
        limit: "1mb",
        extended: true,
        parameterLimit: 1000,
      }),
    );
    this.app.use(corsSettings);
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(responseTime(recordResponseTime));
  }

  private plugInRoutes() {
    this.app.get("/", (req, res) => {
      res.status(200).send("<h1>Successful</h1>");
    });

    this.app.get(Env.API_PATH + "/health", (req, res) => {
      const response = "Server is healthy____   " + new Date().toUTCString();
      res.status(200).send(response);
    });

    const appRoute = new AppRoute(this.app);
    appRoute.initializeRoutes();

    //return a 404 for unspecified/unmatched routes
    this.app.use((req, res) => {
      res.status(404).send("<h1>RESOURCE NOT FOUND</h1>");
    });
  }
}

export default new App().app;
