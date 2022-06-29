import { Request, Response, NextFunction } from 'express';
import Log from '../../middlewares/Log';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../../types';
import IAddress from '../../models/IAddress';
import AuthTools from '../../../utils/auth';
import Command from '../../models/schema/Command';
import ICommand from '../../models/ICommand';

const prisma = new PrismaClient();
class CommandController {
    public static async getAllCommand(req: Request, res: Response, next: NextFunction) {
        const dtoCommand = [];
        try {
            const commands = await Command.find();
            console.log(commands);
            const commandLength = commands.length;
            if (commandLength == 0) {
                Log.error('Route :: [/command/get-all] there is not commands');
                return next(new ApiError({ status: 404, message: 'No commands' }));
            }
            for (let i = 0; i < commandLength; ++i) {
                const addr = await prisma.address.findFirst({
                    where: { uuid: commands[i].address }
                });
                console.log('sz', addr);
                if (addr) {
                    const data = CommandController.toDto(commands[i], addr);
                    dtoCommand.push(data);
                }
            }
            return res.status(200).json(dtoCommand);
        } catch (error) {
            console.log('s', error);
            Log.error('Route :: [/command/get-all :' + error);
            return next(
                new ApiError({
                    status: 500,
                    message: 'Could not retrieve commands'
                })
            );
        }
    }

    public static async getCommandsByUserId(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const { status } = req.body;
        const userId = req.params.userId;
        const queryMapper = {
            delivery_man: Command.find({ delivery: userId }),
            client: Command.find({ userId: userId }),
            restorer: Command.find({ restaurantId: userId })
        };
        try {
            const commands = await queryMapper[status];
            if (commands.length === 0) {
                Log.info(`Route :: [/command/get-all/user/:id] no commands found`);
                return next(new ApiError({ status: 500, message: 'Error from server' }));
            }
            res.status(200).json(commands);
        } catch (error) {
            Log.error(`Route :: [/command/get/:id] server error: ${error}`);
            return next(new ApiError({ status: 500, message: 'Error from server' }));
        }
    }

    public static async getCommandHistoryByUserId(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const { status } = req.body;
        const userId = req.params.userId;
        const queryMapper = {
            delivery_man: Command.find({ delivery: userId, deleted: true }),
            client: Command.find({ userId: userId, deleted: true }),
            restorer: Command.find({ restaurantId: userId, deleted: true })
        };
        try {
            const commands = await queryMapper[status];
            if (commands.length === 0) {
                Log.info(`Route :: [/command/get-all/user/:id] no commands found`);
                return next(new ApiError({ status: 500, message: 'Error from server' }));
            }
            res.status(200).json(commands);
        } catch (error) {
            Log.error(`Route :: [/command/get/:id] server error: ${error}`);
            return next(new ApiError({ status: 500, message: 'Error from server' }));
        }
    }

    public static async createCommand(req: Request, res: Response, next: NextFunction) {
        const { command, address } = req.body;
        const addr = await prisma.address.findMany({
            where: {
                street: address.street
            }
        });
        console.log('a', addr);

        if (addr.length > 0) {
            Log.error('Route :: [/command/create] address already in database');
            return next(
                new ApiError({ status: 409, message: 'Address already existing' })
            );
        }

        address.uuid = AuthTools.uuiGenerator();
        command.uuid = AuthTools.uuiGenerator();

        addr[0] = await prisma.address.create({
            data: address
        });

        if (!addr[0]) {
            Log.error(
                'Route :: [/command/create] could not create this address, maybe it is already existing'
            );
        }

        try {
            const commandCreated = new Command({
                price: command.price,
                products: command.products,
                restaurantId: command.restaurantId,
                address: addr[0].uuid,
                delivery: command.delivery,
                userId: command.userId,
                isAccepted: command.isAccepted,
                isRecieved: command.isRecieved,
                uuid: command.uuid,
                deleted: command.deleted
            });
            console.log('sa', commandCreated);
            const commandSaved = await commandCreated.save();
            if (!commandSaved) {
                return next(
                    new ApiError({
                        status: 500,
                        message: 'Could not create the command'
                    })
                );
            }
            return res.status(201).json('command created');
        } catch (error) {
            console.log('soeszaszass', error);
            return next(
                new ApiError({ status: 500, message: 'Could not create the command' })
            );
        }
    }

    private static toDto(command: ICommand, addr: IAddress) {
        const commandDto = {
            price: command.price,
            products: command.products,
            restaurantId: command.restaurantId,
            delivery: command.delivery,
            userId: command.userId,
            address: addr.street,
            city: addr.city,
            zipCode: addr.zipCode,
            isAccepted: command.isAccepted,
            isRecieved: command.isRecieved,
            uuid: command.uuid,
            deleted: command.deleted
        };

        return commandDto;
    }
}
export default CommandController;
