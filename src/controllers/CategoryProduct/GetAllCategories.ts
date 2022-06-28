import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../../../types';
import Log from '../../middlewares/Log';

import CategoryProduct from '../../models/schema/CategoryProduct';

/**
 * Get all categories from a specific restaurant
 * It displays categories of product like : "Dessert", "Nos coups de coeur" etc...
 *
 * @author Léo DELPON <leo.delpon@viacesi.fr>
 */
class GetAllCategories {
    public static async perform(req: Request, res: Response, next: NextFunction) {
        const restaurantId = req.params.id;
        try {
            const categories = await CategoryProduct.find().where({
                restaurantId: restaurantId
            });
            if (categories.length == 0) {
                Log.error(`Route :: [/category-product/get-all/:id] no categories found`);
                return next(
                    new ApiError({ status: 404, message: 'There is no category' })
                );
            }
            return res.status(200).json(categories);
        } catch (error) {
            Log.error(`Route :: [/category-product/create] server error: ${error}`);
            return next(new ApiError({ status: 500, message: 'Error from server' }));
        }
    }
}

export default GetAllCategories;
