import passport from 'passport';
import { Application } from 'express';

import LocalStrategy from '../services/strategies/Local';
import GoogleStrategy from '../services/strategies/Google';

import Log from '../middlewares/Log';

/**
 *
 */
class Passport {
    public mountPackage(_express: Application): Application {
        _express = _express.use(passport.initialize());
        _express = _express.use(passport.session());

        passport.serializeUser<any, any>((req, user: any, done) => {
            done(null, user.id);
        });

        passport.deserializeUser((obj, cb) => {
            cb(null, obj);
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
