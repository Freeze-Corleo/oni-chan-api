import express from 'express';
import Locals from '../providers/Local';
import Route from '../providers/Route';
import ExceptionHandler from '../exception/Handler';

class Express {
  public express: express.Application;

  /**
   * Initialize the express server
   */
  constructor() {
    this.express = express();

    this.mountDotEnv();
    this.mountMiddlewares();
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
    const port: number = Locals.config().port;

    // Registering Exception / Error Handlers
    this.express.use(ExceptionHandler.logErrors);
    this.express.use(ExceptionHandler.clientErrorHandler);
    this.express.use(ExceptionHandler.errorHandler);
    this.express = ExceptionHandler.notFoundHandler(this.express);

    // Start the server on the specified port
    this.express.listen(port, (): void => {
        return console.log('\x1b[33m%s\x1b[0m', `Server :: Running @ 'http://localhost:${port}'`);
    });
  }
}