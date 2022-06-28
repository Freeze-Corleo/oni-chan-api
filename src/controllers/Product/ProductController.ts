import mongoose, { Schema, model, connect } from 'mongoose';
import express from 'express';
import product from '../../models/schema/Product';
import Log from '../../middlewares/Log';
import IProduct from '../../models/IProduct';
import AllergyController from './AllergyController';

class ProductController {
    public static async requestGetAll(req: express.Request, res: express.Response) {
        return res.send(await ProductController.getAll());
    }

    public static async requestGetById(req: express.Request, res: express.Response) {
        return res.send(await ProductController.getById(String(req.query.id)));
    }

    public static async requestDeleteById(req: express.Request, res: express.Response) {
        return res.send(await ProductController.deleteById(String(req.query.id)));
    }

    public static async requestUpdateById(req: express.Request, res: express.Response) {
        return res.send(
            await ProductController.updateById(String(req.query.id), req.body)
        );
    }

    /**
     * Get every product
     * @author Pierre FORQUES <pierre.forques@viacesi.fr>
     * @param {express.Request} req
     * @param {express.Response} res
     * @returns {JSON}
     */
    private static async getAll() {
        try {
            const allProduct = await product.find({}).exec();
            if (!allProduct) {
                throw new Error('No document found');
            }
            return JSON.stringify(allProduct);
        } catch (error) {
            Log.error(error);
            return JSON.stringify('No product found');
        }
    }

    /**
     * Get product by id
     * @author Pierre FORQUES <pierre.forques@viacesi.fr>
     * @param {express.Request} req : query id
     * @param {express.Response} res
     * @returns {JSON}
     */
    private static async getById(id: string) {
        try {
            const productFound = await product.findById(id).exec();
            if (!productFound) {
                throw new Error('No document found');
            }
            return JSON.stringify(productFound);
        } catch (error) {
            Log.error(error);
            return JSON.stringify('No product found ' + error);
        }
    }

    /**
     * Delete product by id
     * @author Pierre FORQUES <pierre.forques@viacesi.fr>
     * @param {express.Request} req : query id
     * @param {express.Response} res
     * @returns {JSON}
     */
    private static async deleteById(id: string) {
        try {
            const productFound = await product.deleteOne({ _id: id });
            if (!productFound) {
                throw new Error('No document found');
            }
            return JSON.stringify(productFound);
        } catch (error) {
            Log.error(error);
            return JSON.stringify('Cannot delete product');
        }
    }

    /**
     * Update a product
     * @author Pierre FORQUES <pierre.forques@viacesi.fr>
     * @param {express.Request} req : ???????
     * @param {express.Response} res
     * @returns {JSON}
     */
    private static async updateById(id: string, productWanted: IProduct) {
        try {
            const updatableProduct = await product.findOneAndUpdate(
                { _id: id },
                productWanted
            );
            if (!updatableProduct) {
                throw new Error('No document found');
            }
            return JSON.stringify(updatableProduct);
        } catch (error) {
            Log.error(error);
            return JSON.stringify('Cannot update a product');
        }
    }
}
export default ProductController;
