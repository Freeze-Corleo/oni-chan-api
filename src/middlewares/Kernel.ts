/**
 * Register your Express middlewares
 *
 * @author Mike Christopher SYLVESTRE <mike.sylvestre@lyknowledge.io>
 */

import { Application } from 'express';
import CORS from './CORS';
import Http from './Http';

class Kernel {
    public static init(_express: Application): Application {
        // Mount CORS Policy middleware
        _express = CORS.mount(_express);

        // Mount Http request setting
        _express = Http.mount(_express);

        return _express;
    }
}

export default Kernel;
