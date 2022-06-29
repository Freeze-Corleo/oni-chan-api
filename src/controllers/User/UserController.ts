import express, { Request, Response, NextFunction } from 'express';
import Log from '../../middlewares/Log';
import IUser from '../../models/IUser';
import { PrismaClient } from '@prisma/client';

import { ApiError } from '../../../types';

const prisma = new PrismaClient();

//import { PrismaClient } from '@prisma/client'

class UserController {
    /*public static async requestGetAll(req: express.Request, res: express.Response){
        return res.send(await AllergyController.getAll());
    }*/

    public static async requestGetAll(req: express.Request, res: express.Response) {
        return res.send(await UserController.getAll());
    }

    public static async requestDeleteById(req: express.Request, res: express.Response) {
        return res.send(await UserController.deleteById(String(req.query.id)));
    }

    public static async requestCreateOne(req: express.Request, res: express.Response) {
        return res.send(await UserController.createOne(req.body));
    }

    private static async getAll() {
        try {
            const allUsers = await prisma.user.findMany();

            if (!allUsers) {
                throw new Error('No document found');
            }
            return JSON.stringify(allUsers);
        } catch (error) {
            Log.error(error);
            return JSON.stringify('No user found');
        }
    }

    public static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.id;
            const user = await prisma.user.findUnique({
                where: {
                    uuid: userId
                },
                select: {
                    email: true,
                    firstname: true,
                    lastname: true,
                    phone: true,
                    address: true,
                    createdAt: true,
                    updatedAt: true,
                    googleAuth: true,
                    verifyUser: true,
                    status: true,
                    godFather: true,
                    profilUrl: true,
                    uuid: true
                }
            });

            if (!user) {
                Log.error('Route :: [/user/get/:id] user not found');
                return next(new ApiError({ status: 404, message: 'User not found' }));
            }
            return res.status(200).json({ user });
        } catch (error) {
            Log.error(`Route :: [/user/get/:id] server error: ${error}`);
            return next(new ApiError({ status: 500, message: 'Error from server' }));
        }
    }

    private static async deleteById(id: string) {
        try {
            const addresses = await prisma.address.findMany({});
            console.log(addresses);
            let addressToDelete = "";
            for (let address of addresses) {
                if (address.userId == id) {
                    addressToDelete = address.uuid;
                    break;
                }
             }
             const deleteAddress = await prisma.address.delete({
                where: {
                    uuid: addressToDelete
                }
            });
            const deleteUser = await prisma.user.delete({
                where: {
                    uuid: id
                }
            });

            if (!deleteUser || !deleteAddress) {
                throw new Error('No document found');
            }
            return JSON.stringify(deleteUser);
        } catch (error) {
            Log.error(error);
            return JSON.stringify('Cannot delete user');
        }
    }

    public static async updateById(req: Request, res: Response, next: NextFunction) {
        const userId = req.params.id;
        const data = req.body;
        try {
            const user = await prisma.user.findFirst({
                where: { uuid: userId },
                include: { address: true }
            });

            if (!user) {
                Log.error('Route :: [/user/update/:id] user not found');
                return next(new ApiError({ status: 404, message: 'User not found' }));
            }

            user.email = data.email;
            user.firstname = data.firstname;
            user.lastname = data.lastname;
            user.phone = data.phone;
            user.address = data.address;
            user.updatedAt = new Date(Date.now());
            user.googleAuth = data.googleAuth;
            user.verifyUser = data.verifyUser;
            user.godFather = data.godFather;
            user.profilUrl = data.profilUrl;
            user.isBanned = data.isBanned;

            const addrListId = user.address.map((addr) => ({ uuid: addr.uuid }));

            const addresses = [...addrListId];

            const updateUser = await prisma.user.update({
                where: {
                    uuid: userId
                },
                data: {
                    ...user,
                    address: {
                        set: addresses.map((addr) => ({ ...addr }))
                    }
                },
                include: {
                    address: true
                }
            });

            if (!updateUser) {
                Log.error('Route :: [/user/update/:id] user not found');
                return next(new ApiError({ status: 404, message: 'User not found' }));
            }
            return res.status(200).json(updateUser);
        } catch (error) {
            Log.error(`Route :: [/user/get/:id] server error: ${error}`);
            return next(new ApiError({ status: 500, message: 'Error from server' }));
        }
    }

    private static async createOne(userWanted: IUser) {
        // const { PrismaClient } = require('@prisma/client')
        // const prisma = new PrismaClient()
        // try{
        //     const user = await prisma.User.create({data: userWanted});
        //     return JSON.stringify(user);
        // } catch(error){
        //     console.log(error);
        // }
        /*const user = await prisma.user.create({
            data: {
                "email": userWanted.email,
                "firstname": userWanted.firstname,
                "lastname" :userWanted.lastname,
                "password": userWanted.password,
                "phone": userWanted.phone,
                "address": userWanted.address,
                "createdAt": userWanted.createdAt,
                "updatedAt": userWanted.updatedAt,
                "googleAuth": userWanted.googleAuth,
                "verifyUser": userWanted.verifyUser,
                "emailCode": userWanted.emailCode,
                "browser": userWanted.browser,
                "status": userWanted.status,
                "godFather": userWanted.godFather,
                "profilUrl": userWanted.profilUrl,
                "accessToken": userWanted.accessToken,
                "refreshToken": userWanted.refreshToken,
                "corrId": userWanted.corrId,
                "resetToken": userWanted.resetToken,
                "isBanned": userWanted.isBanned,
                "uuid": userWanted.uuid
            }
        })*/
    }
}
export default UserController;
