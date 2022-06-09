/**
 * Define App Locals & Configs
 *
 * @author Léo DELPON <leo.delpon@viacesi.fr>
 */

import { Application } from 'express';
import * as path from 'path';
import * as dotenv from 'dotenv';

class Locals {
    /**
     * Makes env configs available for your app
     * throughout the app's runtime
     */
    public static config(): any {
        dotenv.config({ path: path.join(__dirname, '../../.env') });
        const monitorName = process.env.STATUS_MONITOR_NAME || 'status_monitor';
        const url = process.env.APP_URL || `http://localhost:${process.env.PORT}`;
        const port = process.env.PORT || 8080;
        const mongooseUrl = process.env.MONGOOSE_URL;
        const mslHost = process.env.HOST_MS;
        const apiKey = process.env.API_KEY;
        const msUsername = process.env.USERNAME_MS;
        const msPassword = process.env.PASSWORD_MS;
        const msDB = process.env.DB_MS;
        const msPort = process.env.PORT_MS;
        const apiPrefix = process.env.API_PREFIX || 'oni-chan';
        const appSecret = process.env.APP_SECRET || 'test-secret-string-for-session';

        return {
            apiKey,
            monitorName,
            appSecret,
            mongooseUrl,
            mslHost,
            msUsername,
            msPassword,
            msDB,
            msPort,
            apiPrefix,
            port,
            url
        };
    }

    /**
     * Injects your config to the app's locals
     */
    public static init(_express: Application): Application {
        _express.locals.app = this.config();
        return _express;
    }
}

export default Locals;
