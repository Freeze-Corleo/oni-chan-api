import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

import { ApiError } from '../../../types';
import AuthTools from '../../../utils/auth/index';
import Log from '../../middlewares/Log';
import Mail from '../../helpers/SendGridHelper';
import Locals from '../../providers/Local';

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
                profilUrl: '',
                uuid: user.uuid
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

    public static async logout(req: Request, res: Response) {
        req.session = null;
        res.sendStatus(200);
    }

    public static async changePassword(req: Request, res: Response, next: NextFunction) {
        const uuid = req.body.userId;
        const newPassword = req.body.newPassword;
        const confirmNewPassword = req.body.newPasswordConfirmed;

        if (newPassword !== confirmNewPassword) {
            Log.error("Route :: [/auth/change-password] passwords don't match");
            return next(new ApiError({ status: 400, message: "Passwords don't match" }));
        }

        try {
            await client.user.update({
                where: {
                    uuid
                },
                data: {
                    password: AuthTools.hashPassword(newPassword)
                }
            });
        } catch (error) {
            Log.error('Route :: [/auth/change-password] error while changing password');
            return res.status(500).json({ status: 500, message: error });
        }
    }

    public static async forgotPassword(req: Request, res: Response, next: NextFunction) {
        const email = req.body.email;
        const correlationId = AuthTools.tokenGenerator();
        const resetToken = AuthTools.tokenGenerator();

        try {
            Mail.sendEmail(
                email,
                {
                    link: `${
                        Locals.config().frontUrl
                    }/password_reset/entry?correlationId=${correlationId}&resetToken=${resetToken}`
                },
                Locals.config().templateResetPassword
            );

            // Direct update on JSON fields isn't supported yet
            // https://github.com/prisma/prisma/discussions/3070
            const user = await client.user.findFirst({
                where: {
                    email
                }
            });

            if (!user) {
                Log.error('Route :: [/auth/forgot-password] user does not exist');
                next(new ApiError({ status: 404, message: 'User does not exist' }));
            }

            await client.user.update({
                where: {
                    email
                },
                data: {
                    corrId: correlationId,
                    resetToken: resetToken,
                    ...user
                }
            });

            return res
                .status(200)
                .json({ status: 200, message: 'An email has been sent !' });
        } catch (error) {
            Log.error(
                'Route :: [/auth/forgot-password] error during forgotten password process'
            );
            return res.status(500).json({ status: 500, message: error });
        }
    }
}

export default LoginController;
