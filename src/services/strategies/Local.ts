/**
 * Define passport's local strategy
 *
 * @author Léo DELPON <leo.delpon@viacesi.fr>
 */

import { Strategy } from 'passport-local';
import { PrismaClient } from '@prisma/client';
import Log from '../../middlewares/Log';

const client = new PrismaClient();

class Local {
    public static init(_passport: any): any {
        _passport.use(
            new Strategy({ usernameField: 'email' }, (email, password, done) => {
                Log.info(`Email is ${email}`);
                Log.info(`Password is ${password}`);
            })
        );
    }
}

export default Local;
