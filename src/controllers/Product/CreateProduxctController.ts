import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../../../types';
import Log from '../../middlewares/Log';

import CategoryProduct from '../../models/schema/CategoryProduct';

class CreateProductController {
    public static async performProduct(req: Request, res: Response, next: NextFunction) {
        const { product, customizations } = req.body;
        try {
            return res.status(201);
        } catch (error) {
            Log.error(`Route :: [/category-product/create] server error: ${error}`);
            return next(new ApiError({ status: 500, message: 'Error from server' }));
        }
    }

    public static async performMenu(req: Request, res: Response, next: NextFunction) {
        const { product, customizations } = req.body;
        try {
            console.log('uii');
        } catch (error) {
            Log.error(`Route :: [/category-product/create] server error: ${error}`);
            return next(new ApiError({ status: 500, message: 'Error from server' }));
        }
    }
}

export default CreateProductController;
