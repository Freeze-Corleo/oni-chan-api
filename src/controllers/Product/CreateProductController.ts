import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../../../types';
import Log from '../../middlewares/Log';

import Product from '../../models/schema/Product';
import CustomizationItem from '../../models/schema/CustomizationItem';
import Customization from '../../models/schema/Customization';
import Restaurant from '../../models/schema/Restaurant';

class CreateProductController {
    public static async performProduct(req: Request, res: Response, next: NextFunction) {
        const { product, customizations, categoryId } = req.body;
        const customizationLength = customizations.length;
        const restaurantId = req.params.id;
        try {
            let newProductUpdated;
            const productCreated = new Product({
                title: product.title,
                price: +product.price,
                itemDescription: product.itemDescription,
                category: categoryId,
                imageUrl: product.imageUrl,
                productId: null,
                customizationList: []
            });
            productCreated.save();

            if (customizationLength > 0) {
                for (let i = 0; i < customizationLength; ++i) {
                    try {
                        const custom = new Customization({
                            maxPermitted: +customizations[i].maxPermitted,
                            minPermitted: +customizations[i].minPermitted,
                            title: customizations[i].title,
                            options: []
                        });
                        await custom.save();
                        newProductUpdated = await Product.findOneAndUpdate(
                            { _id: productCreated._id },
                            { $push: { customizationsList: custom } },
                            { returnOriginal: false, upsert: true }
                        );
                    } catch (error) {
                        Log.error(
                            `Route :: [/product/create-product] server error: ${error}`
                        );
                        return next(
                            new ApiError({
                                status: 500,
                                message:
                                    'Error from server while creating cutomization or updating product'
                            })
                        );
                    }
                }
            }

            await Restaurant.findOneAndUpdate(
                { _id: restaurantId },
                { $push: { products: newProductUpdated } },
                { returnOriginal: false, upsert: true }
            );

            return res.status(201).json('product created');
        } catch (error) {
            Log.error(`Route :: [/product/create-product] server error: ${error}`);
            return next(new ApiError({ status: 500, message: 'Error from server' }));
        }
    }

    public static async performMenu(req: Request, res: Response, next: NextFunction) {
        const { product, customizations } = req.body;
        try {
            console.log('uii');
        } catch (error) {
            Log.error(`Route :: [/product/create-menu] server error: ${error}`);
            return next(new ApiError({ status: 500, message: 'Error from server' }));
        }
    }
}

export default CreateProductController;
