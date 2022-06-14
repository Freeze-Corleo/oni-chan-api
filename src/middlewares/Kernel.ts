/**
 * Register your Express middlewares
 *
 * @author Léo DELPON <leo.delpon@viacesi.fr>
 */

import { Application } from 'express';
import CORS from './CORS';
import Http from './Http';
import Swagger from './Swagger';
import Formatter from './Formatter';

class Kernel {
    public static init(_express: Application): Application {
        // Mount CORS Policy middleware
        _express = CORS.mount(_express);

        // Mount Http request setting
        _express = Http.mount(_express);

        // Mount Swagger documentation
        _express = Swagger.getInstance().mount(_express);

        // // Mount middleware formatter
        // _express = Formatter.mount(_express);

        return _express;
    }
}

export default Kernel;
