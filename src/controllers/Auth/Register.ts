import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../../../types';
import AuthTools from '../../../utils/auth/index';
import { PrismaClient } from '@prisma/client';

enum Status {
    RESTORER = 'restorer',
    CLIENT = 'client',
    DELIVERY_MAN = 'delivery_man'
}

const client = new PrismaClient();

/**
 * Implement registration process with email sending process
 *
 * @author Léo DELPON <leo.delpon@viacesi.fr>
 */
class RegisterController {
    public static async perform(req: Request, res: Response, next: NextFunction) {
        let user = undefined;
        try {
            //
            const { email, password, address, zipCode, city, phone, browser, status } =
                req.body;
            if (
                [
                    email,
                    password,
                    address,
                    zipCode,
                    city,
                    phone,
                    browser,
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
                    googleAuth: null,
                    verifyUser: false,
                    emailCode: null,
                    browser,
                    status: status ?? Status.CLIENT,
                    godFather: null,
                    profilUrl: null,
                    isBanned: false,
                    resetToken: null,
                    corrId: null,
                    accessToken: null,
                    refreshToken: null,
                    uuid: AuthTools.uuiGenerator(),
                    password: AuthTools.hashPassword(password)
                }
            });

            const datas = {
                email,
                phone,
                verifyUser: 'false',
                status: user.status,
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
                await client.user.update({
                    where: {
                        uuid: user.uuid
                    },
                    data: {
                        emailCode: 'emailCode'
                    }
                });
            }
        }
    }
}

export default RegisterController;
