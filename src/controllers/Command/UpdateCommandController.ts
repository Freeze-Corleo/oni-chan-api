import { Request, Response, NextFunction } from 'express';
import Log from '../../middlewares/Log';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../../types';
import IAddress from '../../models/IAddress';
import Command from '../../models/schema/Command';
import ICommand from '../../models/ICommand';

const prisma = new PrismaClient();

class UpdateCommandController {
    public static async updateCommand(req: Request, res: Response, next: NextFunction) {
        const { state, deliveryId } = req.body;
        const id = req.params.id;
        let command;
        try {
            if (state === 'accepted_restaurant') {
                await Command.findOneAndUpdate({ _id: id }, { isAccepted: true });
                command = Command.find();
                return res.status(200).json(command);
            } else if (state === 'recieved') {
                command = await Command.findOneAndUpdate(
                    { _id: id },
                    { isRecieved: true }
                );
            } else if (state === 'accepted_delivery_man') {
                command = await Command.findOneAndUpdate(
                    { _id: id },
                    { delivery: deliveryId }
                );
            }

            const user = await prisma.user.findFirst({
                where: { uuid: command.userId }
            });

            const addr = await prisma.address.findFirst({
                where: { uuid: command.address }
            });

            command = UpdateCommandController.toComplexDto(command, addr, user);

            return res.status(200).json(command);
        } catch (error) {
            Log.error(`Route :: [/command/update-command] server error: ${error}`);
            return next(
                new ApiError({ status: 500, message: 'Could not create the command' })
            );
        }
    }

    private static toComplexDto(command: ICommand, addr: IAddress, user: any) {
        const dto = {
            price: command.price,
            products: command.products,
            restaurantId: command.restaurantId,
            delivery: command.delivery,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            phone: user.phone,
            address: addr.street,
            city: addr.city,
            zipCode: addr.zipCode,
            isAccepted: command.isAccepted,
            isRecieved: command.isRecieved,
            uuid: command.uuid,
            deleted: command.deleted,
            _id: command.id
        };

        return dto;
    }
}
export default UpdateCommandController;
