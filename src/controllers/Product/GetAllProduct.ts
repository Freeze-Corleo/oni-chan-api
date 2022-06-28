import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../../../types';
import Log from '../../middlewares/Log';

import Product from '../../models/schema/Product';

class GetAllProductsController {
    public static async performProductByCategory(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const categoryId = req.params.id;
        try {
            const products = await Product.find({ category: categoryId }).sort();
            if (products.length === 0) {
                Log.info(`Route :: [/product/get-all/category/:id] no products founds`);
                return res.status(200).json(products);
            }
            return res.status(200).json(products);
        } catch (error) {
            Log.error(`Route :: [/product/get-all/category/:id] server error: ${error}`);
            return next(new ApiError({ status: 500, message: 'Error from server' }));
        }
    }
}

export default GetAllProductsController;
