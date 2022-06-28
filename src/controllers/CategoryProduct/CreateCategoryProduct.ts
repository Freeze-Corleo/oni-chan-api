import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../../../types';
import Log from '../../middlewares/Log';

import CategoryProduct from '../../models/schema/CategoryProduct';

class CreateCategory {
    public static async perform(req: Request, res: Response, next: NextFunction) {
        const { title, restaurantId } = req.body;
        try {
            const category = new CategoryProduct({
                title,
                restaurantId
            });
            await category.save();
            return res.status(201).json(category);
        } catch (error) {
            Log.error(`Route :: [/category-product/create] server error: ${error}`);
            return next(new ApiError({ status: 500, message: 'Error from server' }));
        }
    }
}

export default CreateCategory;
