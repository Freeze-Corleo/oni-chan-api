import { PrismaClient } from '@prisma/client';
import { Strategy } from 'passport-google-oauth20';
import Locals from '../../providers/Local';
import Log from '../../middlewares/Log';

const client = new PrismaClient();

/**
 * Implement local strategies, by using passport-google-auth module
 */
class Google {
    public init(_passport: any): any {
        _passport.use(
            new Strategy(
                {
                    clientID: Locals.config().googleClientId,
                    clientSecret: Locals.config().googleClientSecret,
                    callbackURL: `http://127.0.0.1:8080/oni-chan/auth/google/callback`,
                    passReqToCallback: true
                },
                (req: any, accessToken: any, profile: any, done: any) => {
                    console.log(req.profile);
                    console.log(req.accessToken, profile);
                    // this.callBackGoogleAuth(req, accessToken, profile, done);
                }
            )
        );
    }

    private callBackGoogleAuth(req: any, accessToken: any, profile: any, done: any) {
        if (req.user) {
            try {
                const user = client.user.findFirst({
                    where: {
                        googleAuth: profile.id
                    }
                });
                if (user) {
                    Log.info('Google Passport :: There is already a Google account');
                }
            } catch (e) {
                done(e);
            }
        } else {
            console.log(accessToken);
            console.log(profile);
        }
    }
}

export default new Google();
