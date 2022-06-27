import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import { ApiError } from '../../../types';
import AuthTools from '../../../utils/auth/index';
import Log from '../../middlewares/Log';
import Partner from '../../models/schema/Partner';

const prisma = new PrismaClient();

/**
 * Implement partnership controller for applying
 *
 * @author Léo DELPON <leo.delpon@viacesi.fr>
 */
class VerifyPartnerController {
    public static async perform(req: Request, res: Response, next: NextFunction) {
        const status = req.body.status;
        const partnerId = req.params.id;
        const password = req.body.password;
        try {
            const partner = await Partner.findById(partnerId);
            partner.status = status;
            partner.save();
            if (status === 'refused') {
                if (!partner) {
                    Log.error(`Route :: [/partner/verify] Partner not found in database`);
                    return next(
                        new ApiError({ status: 404, message: 'Partner not found' })
                    );
                }
                return res.status(200).json({ message: 'Partner is refused by office' });
            }

            const user = await prisma.user.create({
                data: {
                    email: partner.email,
                    address: {
                        connect: {
                            uuid: partner.address
                        }
                    },
                    phone: partner.phone,
                    firstname: partner.firstname,
                    lastname: partner.lastname,
                    createdAt: new Date(Date.now()),
                    updatedAt: new Date(Date.now()),
                    verifyUser: true,
                    emailCode: '',
                    browser: req.headers['user-agent'],
                    status: 'restorer',
                    godFather: '',
                    profilUrl: '',
                    isBanned: false,
                    uuid: AuthTools.uuiGenerator(),
                    password: AuthTools.hashPassword(password)
                }
            });

            partner.userId = user.uuid;
            partner.save();
            return res.status(201).json('created');
        } catch (err) {
            Log.error(`Route :: [/partner/create] server error: ${err}`);
            return next(new ApiError({ status: 500, message: 'Error from server' }));
        }
    }
}

export default VerifyPartnerController;
