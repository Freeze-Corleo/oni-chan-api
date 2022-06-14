import { PrismaClient } from '@prisma/client';
import { Strategy } from 'passport-google-oauth20';
import Locals from '../../providers/Local';
import Log from '../../middlewares/Log';

import AuthTools from '../../../utils/auth/index';

enum Status {
    RESTORER = 'restorer',
    CLIENT = 'client',
    DELIVERY_MAN = 'delivery_man'
}

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
                async (
                    req: Request,
                    accessToken: string,
                    refreshToken: string,
                    profile: any,
                    done: any
                ) => {
                    this.callBackGoogleAuth(req, accessToken, profile, done);
                }
            )
        );
    }

    private async callBackGoogleAuth(
        req: Request,
        accessToken: string,
        profile: any,
        done: any
    ) {
        if (profile.id) {
            try {
                // Check first if a user has authenticated using Google OAuth2
                let user = await client.user.findFirst({
                    where: {
                        googleAuth: profile.id
                    }
                });

                // if user already signed in once using Google OAuth2 return user
                if (user) {
                    Log.info('Google Passport :: There is already a Google account');
                    return done(null, user);
                }

                user = await client.user.findFirst({
                    where: {
                        email: profile.emails[0].value
                    }
                });

                // user exist, updating informations for Google OAuth2
                if (user) {
                    user.accessToken = accessToken;
                    user.profilUrl = profile._json.picture;
                    user.googleAuth = profile.id;
                    user.firstname = profile._json.given_name;
                    user.lastname = profile._json.family_name;
                    user.browser = req.headers['user-agent'];

                    await client.user.update({
                        where: {
                            uuid: user.uuid
                        },
                        data: {
                            ...user
                        }
                    });

                    return done(null, user);
                }

                const userCreated = await client.user.create({
                    data: {
                        email: profile.emails[0].value,
                        phone: '',
                        firstname: profile._json.given_name,
                        lastname: profile._json.family_name,
                        createdAt: new Date(Date.now()),
                        updatedAt: new Date(Date.now()),
                        googleAuth: profile.id,
                        verifyUser: true,
                        emailCode: '',
                        browser: req.headers['user-agent'],
                        status: Status.CLIENT,
                        godFather: '',
                        profilUrl: profile._json.picture,
                        isBanned: false,
                        resetToken: '',
                        corrId: '',
                        accessToken,
                        refreshToken: '',
                        uuid: AuthTools.uuiGenerator(),
                        password: AuthTools.hashPassword(AuthTools.uuiGenerator())
                    }
                });

                return done(null, userCreated);
            } catch (e) {
                return done(e);
            }
        }
    }
}

export default new Google();
