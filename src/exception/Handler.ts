/**
 * Define the error & exception handlers
 *
 * @author Léo DELPON <leo.delpon@viacesi.fr>
 */

import { Application } from 'express';
import Log from '../middlewares/Log';
import Locals from '../providers/Local';

class ExceptionHandler {
  public static logErrors() {

  }

  public static clientErrorHandler() {

  }

  public static errorHandler() {

  }

  /**
   * Handle all routes that are not found
   * @param {Application} _express express application
   * @returns {Application}
   */
  public static notFoundHandler(_express: Application): any {
    const apiPrefix = Locals.config().apiPrefix;

    _express.use('*', (req, res) => {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        Log.error(`Path '${req.originalUrl}' not found [IP: '${ip}']!`);
        if (req.xhr || req.originalUrl.includes(`/${apiPrefix}/`)) {
            return res.json({
                error: 'Page Not Found'
            });
        } else {
            return res.status(404).json({code: 404, message: "Page not found"});
        }
    });

    return _express;
  }
}


export default ExceptionHandler;