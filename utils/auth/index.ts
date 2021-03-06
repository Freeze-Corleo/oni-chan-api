import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import Local from '../../src/providers/Local';

class AuthTools {
    /**
     * Will hash the password by asynchronously salting the password
     * @param password password string that will be hashed
     * @returns {string} password hashed
     */
    public static hashPassword(password: string): string {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    }

    /**
     * This generates a Json web token for authentification check from big-mom-api
     * @param {email:string, phone: string, verifyUser: string, userType: string, profilUrl: string} user
     * @returns {string}
     */
    public static generateToken(user: {
        email: string;
        phone: string;
        verifyUser: string;
        status: string;
        profilUrl: string;
    }): string {
        return jwt.sign(user, Local.config().jwtSecret, {
            expiresIn: '72h'
        });
    }

    /**
     * Compare the hash password with a string
     * @param password
     * @param hash
     * @returns
     */
    public static checkPassword(password: string, hash: string) {
        return bcrypt.compareSync(password, hash);
    }

    /**
     *
     */
    public static uuiGenerator() {
        return uuidv4();
    }

    /**
     * generate a token
     */
    public static tokenGenerator() {
        return (
            Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2)
        );
    }

    /**
     * Generate a 4-digit code for email validation
     * @returns {string}
     */
    public static generateRandomVerificationCode() {
        return (Math.floor(Math.random() * 9000) + 1000).toString();
    }
}

export default AuthTools;
