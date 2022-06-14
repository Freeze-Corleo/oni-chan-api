import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { ApiError } from '../../../types';

import Log from '../../middlewares/Log';
import Locals from '../../providers/Local';

enum Status {
    RESTORER = 'restorer',
    CLIENT = 'client',
    DELIVERY_MAN = 'delivery_man'
}

class PrivilegeHandler {
    public static isBigMom(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.query.apiToken;
            if (Locals.config().apiKey !== token) {
                return next(
                    new ApiError({
                        status: 401,
                        message: 'Forbidden access'
                    })
                );
            }
            return next();
        } catch (error) {
            Log.error(`API_KEY check error :: an error has occured: ${error}`);
            return res.status(500).json({ status: 500, message: error });
        }
    }

    public static isRestaurant(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.headers.authorization.split(' ')[0] === 'Bearer ') {
                const jwtToken = req.headers.authorization.split(' ')[1];
                const decodedToken = jwt.decode(jwtToken, { complete: true });
                if (decodedToken.payload['status'] === Status.DELIVERY_MAN) {
                    return next();
                }

                return res
                    .status(401)
                    .json({ status: 401, message: 'Authenticated but not a restaurant' });
            }

            return res.status(401).json({
                status: 401,
                message: 'Access forbidden you are not a restaurant'
            });
        } catch (error) {
            Log.error(`JWT Token error :: an error has occured : ${error}`);
            return res.status(500).json({ status: 500, message: error });
        }
    }
}

export default PrivilegeHandler;
