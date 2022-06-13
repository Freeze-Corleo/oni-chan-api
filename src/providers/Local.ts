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
        const mongooseUrl =
            process.env.MONGOOSE_URL ||
            'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false';
        const mslHost = process.env.HOST_MS;
        const apiKey = process.env.API_KEY;
        const msUsername = process.env.USERNAME_MS;
        const msPassword = process.env.PASSWORD_MS;
        const msDB = process.env.DB_MS;
        const msPort = process.env.PORT_MS;
        const apiPrefix = process.env.API_PREFIX || 'oni-chan';
        const appSecret = process.env.APP_SECRET || 'test-secret-string-for-session';
        const jwtSecret = process.env.JWT_SECRET || 'secret-api-freeze-corleonnnne';
        const nodeEnv = process.env.NODE_ENV || 'test';
        const sendGridKey = process.env.SEND_GRID_KEY || '';
        const googleClientId = process.env.GOOGLE_CLIENT_ID || '';
        const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
        const emailCodeTemplateId = process.env.SG_REGISTER_TEMPLATE || '';
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
            url,
            jwtSecret,
            nodeEnv,
            sendGridKey,
            googleClientId,
            googleClientSecret,
            emailCodeTemplateId
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
