import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import { ApiError } from '../../../types';
import AuthTools from '../../../utils/auth/index';
import Log from '../../middlewares/Log';

const client = new PrismaClient();

/**
 * Implement verification process for email validation
 *
 * @author Léo DELPON <leo.delpon@viacesi.fr>
 */
class VerificationController {
    public static async perform(req: Request, res: Response, next: NextFunction) {
        let user = undefined;
        const userId = req.params.id;
        const verificationCode = req.params.emailCode;
        try {
            // Get user by id and then extract the user's email code
            user = await client.user.findUnique({
                where: {
                    uuid: userId
                }
            });

            if (!user) {
                Log.error('Route :: [/auth/verify] user not found');
                return next(new ApiError({ status: 404, message: 'User not found' }));
            }

            if (verificationCode === user.emailCode) {
                user.verifyUser = true;
                user.emailCode = '';
                await client.user.update({
                    where: {
                        uuid: user.uuid
                    },
                    data: {
                        ...user
                    }
                });

                const datas = {
                    email: user.email,
                    phone: user.phone,
                    verifyUser: 'true',
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
            }

            return res.status(500).json({ status: 500, message: 'Error from server' });
        } catch (error) {
            Log.error(`Route :: [/auth/verify] server error: ${error}`);
            return next(new ApiError({ status: 500, message: 'Error from server' }));
        }
    }
}

export default VerificationController;
