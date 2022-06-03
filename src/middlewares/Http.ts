/**
 * Defines all the requisites in HTTP
 *
 * @author Léo DELPON <leo.delpon@viacesi.fr>
 */
 import { Application } from 'express';
 import * as bodyParser from 'body-parser';
 import Log from './Log';
 import Locals from '../providers/Local';


 const cors = require('cors');
 const session = require('express-session');
 const expressValidator = require('express-validator');
 const flash = require('express-flash');
 const compress = require('compression');

 class Http {
     public static mount(_express: Application): Application {
         Log.info('Http :: Booting the \'HTTP\' middleware...');

         // Enables the request body parser
         _express.use(bodyParser.json({
             limit: Locals.config().maxUploadLimit
         }));

         _express.use(bodyParser.urlencoded({
             limit: Locals.config().maxUploadLimit,
             parameterLimit: Locals.config().maxParameterLimit,
             extended: false
         }));

         // Disable the x-powered-by header in response
         _express.disable('x-powered-by');

         // Enables the request payload validator
         _express.use(expressValidator());

         // Enables the request flash messages
         _express.use(flash());

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
                 maxAge: 1209600000 // two weeks (in ms)
             }
         };

         _express.use(session(options));

         // Enables the CORS
         _express.use(cors());

         // Enables the "gzip" / "deflate" compression for response
         _express.use(compress());

         return _express;
     }
 }

 export default Http;