import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../../../types';
import Log from '../../middlewares/Log';
import Locals from '../../providers/Local';

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
}

export default PrivilegeHandler;
