import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../../../types';
import Log from '../../middlewares/Log';

import Product from '../../models/schema/Product';
import Customization from '../../models/schema/Customization';
import Restaurant from '../../models/schema/Restaurant';

class DeleteProductController {
    public static async perform(req: Request, res: Response, next: NextFunction) {
        const productId = req.params.id;
        const restaurantId = req.params.restoId;
        try {
            const product = await Product.findById(productId);

            const customizationListId = product.customizationsList;
            const customizationListIdLength = customizationListId.length;
            if (customizationListIdLength > 0) {
                for (let i = 0; i < customizationListIdLength; ++i) {
                    await Customization.deleteOne({ _id: customizationListId[i] });
                }
            }
            await Restaurant.findOneAndUpdate(
                { _id: restaurantId },
                { $pull: { products: { $elemMatch: { _id: productId } } } }
            );

            await Product.deleteOne({ _id: productId });

            return res.status(200).json(productId);
        } catch (error) {
            Log.error(`Route :: [/product/get-all/category/:id] server error: ${error}`);
            return next(new ApiError({ status: 500, message: 'Error from server' }));
        }
    }
}

export default DeleteProductController;
