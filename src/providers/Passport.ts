import passport from 'passport';
import { Application } from 'express';
import { PrismaClient } from '@prisma/client';

import LocalStrategy from '../services/strategies/Local';
import GoogleStrategy from '../services/strategies/Google';

import Log from '../middlewares/Log';

const client = new PrismaClient();

/**
 *
 */
class Passport {
    public mountPackage(_express: Application): Application {
        _express = _express.use(passport.initialize());
        _express = _express.use(passport.session());

        passport.serializeUser<any, any>((user: any, done) => {
            // after the google passport check the payload is redirected here
            done(null, user.uuid);
        });

        passport.deserializeUser(async (id, done) => {
            const user = await client.user.findUnique({
                where: { uuid: id }
            });
            done(null, user);
        });

        this.mountLocalStrategies();

        return _express;
    }

    public mountLocalStrategies(): void {
        try {
            LocalStrategy.init(passport);
            GoogleStrategy.init(passport);
        } catch (_err) {
            Log.error(_err.stack);
        }
    }
}

export default new Passport();
