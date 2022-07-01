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
    public static async createCommand(req: Request, res: Response, next: NextFunction) {
        const { command } = req.body;
        const addr = await prisma.address.findMany({
            where: {
                uuid: command.address
            }
        });

        if (addr.length == 0) {
            Log.error('Route :: [/command/create] there is no address existing');
            return next(new ApiError({ status: 404, message: 'No address' }));
        }

        command.uuid = AuthTools.uuiGenerator();

        try {
            const commandCreated = new Command({
                price: command.price,
                products: command.products,
                restaurantId: command.restaurantId,
                address: addr[0].uuid,
                delivery: null,
                userId: command.userId,
                isAccepted: command.isAccepted,
                isRecieved: command.isRecieved,
                uuid: command.uuid,
                deleted: command.deleted,
                createdAt: Date.now()
            });

            const commandSaved = await commandCreated.save();
            if (!commandSaved) {
                Log.error(`Route :: [/command/create] server error`);
                return next(
                    new ApiError({
                        status: 500,
                        message: 'Could not create the command'
                    })
                );
            }
            return res.status(201).json(commandSaved);
        } catch (error) {
            Log.error(`Route :: [/command/create] server error: ${error}`);
            return next(
                new ApiError({ status: 500, message: 'Could not create the command' })
            );
        }
    }

    public static async getCommandByRestaurantId(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const dtoCommands = [];
            const commands = await Command.find({ restaurantId: req.params.id })
                .populate({ path: 'restaurantId' })
                .exec(); //isrecceived : true
            const commandsLength = commands.length;

            const commandLength = commands.length;
            if (commandLength == 0) {
                Log.info(
                    'Route :: [/command/by-restaurant] there is not commands for this restaurant'
                );
                return res.status(200).json(commands);
            }
            for (let i = 0; i < commandsLength; i++) {
                const user = await prisma.user.findFirst({
                    where: { uuid: commands[i].userId }
                });
                const addr = await prisma.address.findFirst({
                    where: { uuid: commands[i].address }
                });
                const data = CommandController.toComplexDto(commands[i], addr, user);
                dtoCommands.push(data);
            }
            return res.status(200).json(dtoCommands);
        } catch (error) {
            Log.error('Route :: [/command/by-restaurant :' + error);
            return next(
                new ApiError({
                    status: 500,
                    message: 'Could not retrieve commands by restaurant id'
                })
            );
        }
    }

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
                if (addr) {
                    const data = CommandController.toDto(commands[i], addr);
                    dtoCommand.push(data);
                }
            }
            return res.status(200).json(dtoCommand);
        } catch (error) {
            Log.error('Route :: [/command/get-all :' + error);
            return next(
                new ApiError({
                    status: 500,
                    message: 'Could not retrieve commands'
                })
            );
        }
    }

    public static async deleteCommand(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;

        try {
            await Command.deleteOne({ _id: id });
        } catch (error) {
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
            /*if (commands.length === 0) {
                Log.info(`Route :: [/command/get-all/user/:id] no commands found`);
                return next(new ApiError({ status: 500, message: 'Error from server' }));
            }*/
            res.status(200).json(commands);
        } catch (error) {
            Log.error(`Route :: [/command/get/:id] server error: ${error}`);
            return next(new ApiError({ status: 500, message: 'Error from server' }));
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
            deleted: command.deleted,
            _id: command._id
        };

        return commandDto;
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
            _id: command._id
        };

        return dto;
    }
}
export default CommandController;
