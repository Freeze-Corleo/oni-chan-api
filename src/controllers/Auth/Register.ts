import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../../../types';
import AuthTools from '../../../utils/auth/index';
import { PrismaClient } from '@prisma/client';

const client = new PrismaClient();

class RegisterController {
    public static async perform(req: Request, res: Response, next: NextFunction) {
        let user = undefined;
        try {
            const {
                email,
                password,
                address,
                zipCode,
                city,
                phone,
                browser,
                isPartner,
                isDeliver
            } = req.body;
            if (
                [
                    email,
                    password,
                    address,
                    zipCode,
                    city,
                    phone,
                    browser,
                    isPartner,
                    isDeliver
                ].includes(undefined)
            ) {
                return next(
                    new ApiError({
                        status: 400,
                        message: 'Missing required fields'
                    })
                );
            }

            user = await client.user.create({
                data: {
                    email,
                    address: {
                        create: {
                            street: address,
                            number: null,
                            city: city,
                            zipCode,
                            uuid: AuthTools.uuiGenerator()
                        }
                    },
                    phone,
                    createdAt: new Date(Date.now()),
                    updatedAt: new Date(Date.now()),
                    googleAuth: false,
                    verifyUser: false,
                    emailCode: null,
                    browser,
                    isPartner,
                    isDeliver,
                    godFather: null,
                    profilUrl: null,
                    isBanned: false,
                    uuid: AuthTools.uuiGenerator(),
                    password: AuthTools.hashPassword(password)
                }
            });

            const datas = {
                email,
                phone,
                verifyUser: 'false',
                userType: isPartner ? 'true' : 'false',
                profilUrl: ''
            };

            const token = AuthTools.generateToken(datas);

            return res
                .cookie('FREEZE_JWT', token, {
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3)
                })
                .json({
                    token
                });
        } catch (error) {
            if (error.code === 'P2002') {
                // return res.status(400).json({
                //     message: 'User already exists',
                // });
                return next(
                    new ApiError({
                        status: 400,
                        message: 'User already exists'
                    })
                );
            }
            return next(error);
        } finally {
            if (user) {
                // Envoyer le système de la notification par e-mail
            }
        }
    }
}

export default RegisterController;
