/**
 * Defines all the requisites in HTTP
 *
 * @author Léo DELPON <leo.delpon@viacesi.fr>
 */
import { Application } from 'express';
import * as bodyParser from 'body-parser';
import Log from './Log';
import Locals from '../providers/Local';
import Passport from '../providers/Passport';

import cors from 'cors';
import session from 'express-session';
import flash from 'express-flash';
import compress from 'compression';
import helmet from 'helmet';

class Http {
    public static mount(_express: Application): Application {
        Log.info("Http :: Booting the 'HTTP' middleware...");

        /**
         * Enables the session store
         *
         * Note: You can also add redis-store
         * into the options object.
         */
        const options = {
            resave: true,
            saveUninitialized: true,
            secret: Locals.config().appSecret,
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 // one day (in ms)
            }
        };

        _express.use(session(options));

        // Enables the request body parser
        _express.use(
            bodyParser.json({
                limit: Locals.config().maxUploadLimit
            })
        );

        _express.use(
            bodyParser.urlencoded({
                limit: Locals.config().maxUploadLimit,
                parameterLimit: Locals.config().maxParameterLimit,
                extended: false
            })
        );

        // Disable the x-powered-by header in response
        _express.disable('x-powered-by');

        // Enables the request flash messages
        _express.use(flash());

        // Helmet helps you secure your Express apps by setting various HTTP headers.
        _express.use(helmet());

        // Loads the passport configuration
        _express = Passport.mountPackage(_express);

        // Enables the CORS
        _express.use(cors());

        // Enables the "gzip" / "deflate" compression for response
        _express.use(compress());

        return _express;
    }
}

export default Http;
