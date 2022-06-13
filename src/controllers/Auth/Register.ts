import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import { ApiError } from '../../../types';
import AuthTools from '../../../utils/auth/index';
import Mail from '../../helpers/SendGridHelper';
import Locals from '../../providers/Local';

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
            const { email, password, address, zipCode, city, phone, status } = req.body;

            if (
                [email, password, address, zipCode, city, phone, status].includes(
                    undefined
                )
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
                            number: '',
                            city: city,
                            zipCode,
                            uuid: AuthTools.uuiGenerator()
                        }
                    },
                    phone,
                    firstname: '',
                    lastname: '',
                    createdAt: new Date(Date.now()),
                    updatedAt: new Date(Date.now()),
                    googleAuth: '',
                    verifyUser: false,
                    emailCode: '',
                    browser: req.headers['user-agent'],
                    status: status ?? Status.CLIENT,
                    godFather: '',
                    profilUrl: '',
                    isBanned: false,
                    resetToken: '',
                    corrId: '',
                    accessToken: '',
                    refreshToken: '',
                    uuid: AuthTools.uuiGenerator(),
                    password: AuthTools.hashPassword(password)
                }
            });

            // return id to be sent to the /auth/verify/:id/:emailCode endpoint for verification
            return res.status(201).json({ status: 201, message: user.uuid });
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
                const verificationCode = AuthTools.generateRandomVerificationCode();
                await client.user.update({
                    where: {
                        uuid: user.uuid
                    },
                    data: {
                        emailCode: verificationCode
                    }
                });

                Mail.sendEmail(
                    user.email,
                    {
                        code1: verificationCode[0],
                        code2: verificationCode[1],
                        code3: verificationCode[2],
                        code4: verificationCode[3]
                    },
                    Locals.config().emailCodeTemplateId
                );
            }
        }
    }
}

export default RegisterController;
