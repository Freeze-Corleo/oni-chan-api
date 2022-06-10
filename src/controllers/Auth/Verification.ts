import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import { ApiError } from '../../../types';
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
                Log.error('Route :: [/verify-code] user already exist');
                return next(new ApiError({ status: 404, message: 'User not found' }));
            }

            if (verificationCode === user.emailCode) {
                return res
                    .status(202)
                    .json({ status: 202, message: 'Validation code matched' });
            }

            return res.status(500).json({ status: 500, message: 'Error from server' });
        } catch (error) {
            Log.error(`Route :: [/verify-code] server error: ${error}`);
            return next(new ApiError({ status: 500, message: 'Error from server' }));
        }
    }
}

export default VerificationController;
