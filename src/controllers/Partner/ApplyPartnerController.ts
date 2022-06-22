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
class ApplyPartnerController {
    public static async perform(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                name,
                siren,
                address,
                zipCode,
                city,
                activity,
                firstname,
                lastname,
                email,
                phone,
                status
            } = req.body;

            if (
                [
                    name,
                    siren,
                    address,
                    activity,
                    firstname,
                    lastname,
                    email,
                    phone,
                    status
                ].includes(undefined)
            ) {
                return next(
                    new ApiError({
                        status: 400,
                        message: 'Missing required fields'
                    })
                );
            }

            const addr = await prisma.address.findMany({
                where: {
                    street: address
                }
            });

            if (addr.length > 0) {
                Log.error('Route :: [/user/get/:id] address already in database');
                return next(
                    new ApiError({ status: 409, message: 'Address already existing' })
                );
            }

            addr[0] = await prisma.address.create({
                data: {
                    street: address,
                    number: '',
                    city,
                    zipCode,
                    uuid: AuthTools.uuiGenerator(),
                    userId: null
                }
            });

            const partner = new Partner({
                name,
                siren,
                address: addr[0].uuid,
                activity,
                firstname,
                lastname,
                email,
                phone,
                status: 'pending'
            });

            const partnerSaved = await partner.save();

            return res.status(201).json(partnerSaved);
        } catch (err) {
            Log.error(`Route :: [/auth/verify] server error: ${err}`);
            return next(new ApiError({ status: 500, message: 'Error from server' }));
        }
    }
}

export default ApplyPartnerController;
