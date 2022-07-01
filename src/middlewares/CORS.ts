/**
 * Enables the CORS
 *
 * @author Léo DELPON <leo.delpon@viacesi.fr>
 */

import { Application } from 'express';

import Log from './Log';
import Locals from '../providers/Local';

class CORS {
    public cors = require('cors');
    public mount(_express: Application): Application {
        Log.info("CORS :: Booting the 'CORS' middleware...");

        const options = {
            origin: [
                'https://oni-chan-dashbard.vercel.app,',
                'https://test-onichan-api.herokuapp.com'
            ],
            transports: ['websocket', 'polling'],
            optionsSuccessStatus: 200 // Some legacy browsers choke on 204
        };

        _express.use(this.cors(options));

        return _express;
    }
}

export default new CORS();
