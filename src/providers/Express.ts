import express from 'express';

import Locals from '../providers/Local';
import Route from '../providers/Route';
import Log from '../middlewares/Log';
import Kernel from '../middlewares/Kernel';
import ExceptionHandler from '../exception/Handler';

class Express {
  public express: express.Application;

  /**
   * Initialize the express server
   */
  constructor() {
    this.express = express();
    Log.info("Express :: Mounting process for Express server");
    this.mountMiddlewares();
    this.mountDotEnv();
    this.mountRoutes();
  }

  /**
   * Mount the environment variables
   */
  private mountDotEnv() {
    this.express = Locals.init(this.express);
  }

  /**
   * Mount all middlewares for express server
   */
  private mountMiddlewares() {
    Kernel.init(this.express);
  }

  /**
   * Mount the API routes
   */
  private mountRoutes() {
    this.express = Route.mountApi(this.express);
  }

  /**
   * Starts the express server
   */
  public init(): any {
    Log.info("Express :: Initializing Express server");
    const port: number = Locals.config().port;

    // Registering Exception / Error Handlers
    this.express.use(ExceptionHandler.logErrors);
    this.express.use(ExceptionHandler.clientErrorHandler);
    this.express.use(ExceptionHandler.errorHandler);
    this.express = ExceptionHandler.notFoundHandler(this.express);

    // Start the server on the specified port
    this.express.listen(port, (): void => {
        return console.log('\x1b[33m%s\x1b[0m', `[INFO] Server :: Running server at 'http://localhost:${port}'`);
    });
    Log.info(`Express :: Server listening on port ${port}`);
  }
}

export default new Express();