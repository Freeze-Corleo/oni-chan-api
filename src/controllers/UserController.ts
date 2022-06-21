import express from 'express';
import Log from '../middlewares/Log';
import IUser from '../models/IUser';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

//import { PrismaClient } from '@prisma/client'

class UserController{
   /*public static async requestGetAll(req: express.Request, res: express.Response){
        return res.send(await AllergyController.getAll());
    }*/

    public static async requestGetAll(req: express.Request, res: express.Response){
        return res.send(await UserController.getAll());
    }

    public static async requestGetById(req: express.Request, res: express.Response){
        return res.send(await UserController.getById(String(req.query.id)));
    }

    public static async requestDeleteById(req: express.Request, res: express.Response){
        return res.send(await UserController.deleteById(String(req.query.id)));
    }

    public static async requestCreateOne(req: express.Request, res: express.Response){
        return res.send(await UserController.createOne(req.body));
    }

    public static async requestUpdateById(req: express.Request, res: express.Response){
        return res.send(await UserController.updateById(String(req.query.id), req.body));
    }

    private static async getAll(){
        try {
            const allUsers = await prisma.user.findMany()

            if(!allUsers) {
              throw new Error('No document found');
            }
            return JSON.stringify(allUsers);
        } catch (error) {
            Log.error(error);
            return JSON.stringify('No user found');
        }
    }

    private static async getById(id: string){
        try {
            const user = await prisma.user.findUnique({
                where: {
                  uuid: id,
                },
            });

            if(!user) {
              throw new Error('No document found');
            }
            return JSON.stringify(user);
        } catch (error) {
            Log.error(error);
            return JSON.stringify('No user found');
        }
    }

    private static async deleteById(id: string){
        try {
            const deleteUser = await prisma.user.delete({
                where: {
                  uuid: id,
                },
              })
            if(!deleteUser) {
              throw new Error('No document found');
            }
            return JSON.stringify(deleteUser);
        } catch (error) {
            Log.error(error);
            return JSON.stringify('Cannot delete user');
        }
    }

    private static async updateById(id: string, updatedUser: IUser){
        try {
            const updateUser = await prisma.user.update({
                where: {
                  uuid: id,
                },
               data: {
               }
            });

            if(!updateUser) {
              throw new Error('No document found');
            }
            return JSON.stringify(updateUser);
        } catch (error) {
            Log.error(error);
            return JSON.stringify('Cannot update a category product');
        }
    }

    private static async createOne(userWanted: IUser){
        const { PrismaClient } = require('@prisma/client')
        const prisma = new PrismaClient()

        try{
            const user = await prisma.User.create({data: userWanted});
            return JSON.stringify(user);
        } catch(error){
            console.log(error);
        }

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

} export default UserController;