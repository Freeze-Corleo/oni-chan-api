
import { Application } from 'express';
import Locals from './Local';
import Log from '../middlewares/Log';

import apiRouter from './../routes/Api';

/**
 * Implement Route class to mount and use API routes too
 *
 * @author Léo DELPON <leo.delpon@viacesi.fr>
 */
class Route {
  public mountApi(_express: Application): Application {
    const apiPrefix = Locals.config().apiPrefix;
    Log.info('[+] Route [object] :: Mounting API routes');

    return _express.use(`/${apiPrefix}`, apiRouter);
  }
}

export default new Route;