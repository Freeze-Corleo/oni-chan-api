import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

import { ApiError } from '../../../types';
import AuthTools from '../../../utils/auth/index';
import Log from '../../middlewares/Log';

const client = new PrismaClient();

/**
 * Implement login process and password forgotten process and logout process
 *
 * @author Léo DELPON <leo.delpon@viacesi.fr>
 */
class LoginController {
    public static async perform(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;

            console.log(req.body);
            const user = await client.user.findFirst({
                where: {
                    email
                },
                select: {
                    address: true,
                    uuid: true,
                    password: true,
                    email: true,
                    phone: true,
                    status: true,
                    verifyUser: true,
                    profilUrl: true
                }
            });

            if (!user) {
                Log.error('Route :: [/auth/login] user does not exist');
                return next(
                    new ApiError({
                        status: 404,
                        message: 'User not found'
                    })
                );
            }

            if (!AuthTools.checkPassword(password, user.password)) {
                Log.error('Route :: [/auth/login] password incorrect');
                return next(
                    new ApiError({
                        status: 401,
                        message: 'Invalid credentials'
                    })
                );
            }

            const datas = {
                email,
                phone: user.phone,
                verifyUser: 'false',
                status: user.status,
                profilUrl: ''
            };

            const token = AuthTools.generateToken(datas);

            return res
                .cookie('FREEZE_JWT', token, {
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3)
                })
                .json({
                    token
                });
        } catch (error) {
            Log.error(`Route :: [/auth/login] server error: ${error}`);
            next(error);
        }
    }
}

export default LoginController;
