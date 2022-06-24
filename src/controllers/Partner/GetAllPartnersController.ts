import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import { ApiError } from '../../../types';
import Log from '../../middlewares/Log';
import Partner from '../../models/schema/Partner';
import IPartner from '../../models/IPartner';
import IAddress from '../../models/IAddress';

const prisma = new PrismaClient();

/**
 * Implement partnership controller for applying
 *
 * @author Léo DELPON <leo.delpon@viacesi.fr>
 */
class GetAllPartnersController {
    public static async perform(req: Request, res: Response, next: NextFunction) {
        const { page = 0, limit = 20 } = req.query;
        try {
            const dtoPartners = [];
            const partners = await Partner.find({
                skip: Math.max(0, +page - 1) * +limit,
                limit: +limit
            });
            const partnersLength = partners.length;

            if (partnersLength === 0) {
                Log.error(`Route :: [/partner/get-all] Not parteners found`);
                return next(
                    new ApiError({
                        status: 404,
                        message: 'Error there are no partner candidacies'
                    })
                );
            }

            for (let i = 0; i < partnersLength; ++i) {
                const addr = await prisma.address.findFirst({
                    where: { uuid: partners[i].address }
                });
                const data = GetAllPartnersController.toDTO(partners[i], addr);
                dtoPartners.push(data);
            }

            return res.status(200).json(dtoPartners);
        } catch (error) {
            Log.error(`Route :: [/partner/get-all] server error: ${error}`);
            return next(new ApiError({ status: 500, message: 'Error from server' }));
        }
    }

    private static toDTO(partner: IPartner, addr: IAddress) {
        const partnerDTO = {
            name: partner.name,
            address: addr,
            siren: partner.siren,
            activity: partner.activity,
            firstname: partner.firstname,
            lastname: partner.lastname,
            email: partner.email,
            phone: partner.phone,
            userId: partner.userId,
            createdAt: partner.createdAt,
            updatedAt: partner.updatedAt,
            restaurants: partner.restaurants,
            id: partner._id,
            status: partner.status
        };
        return partnerDTO;
    }
}

export default GetAllPartnersController;
