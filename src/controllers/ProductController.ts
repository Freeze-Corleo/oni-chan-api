import mongoose, { Schema, model, connect } from 'mongoose';
import express from 'express';
import product from '../models/schema/Product';
import Log from '../middlewares/Log';

class ProductController{
    /**
     * Get every product
     * @author Pierre FORQUES <pierre.forques@viacesi.fr>
     * @param {express.Request} req
     * @param {express.Response} res
     * @returns {JSON}
     */
    public static async getAll(req: express.Request, res: express.Response){  
        try {
            const allProduct = await product.find({}).exec();
            if(!allProduct) {
              throw new Error('No document found');
            }
            return res.send(JSON.stringify(allProduct));
        } catch (error) {
            Log.error(error);
            return res.status(404).send('No product found');
        }
    }

    /**
     * Get product by id
     * @author Pierre FORQUES <pierre.forques@viacesi.fr>
     * @param {express.Request} req : query id
     * @param {express.Response} res
     * @returns {JSON}
     */
    public static async getById(req: express.Request, res: express.Response){
        try {
            const productFound = await product.findById(req.query.id).exec();
            if(!productFound) {
              throw new Error('No document found');
            }
            return res.send(JSON.stringify(productFound));
        } catch (error) {
            Log.error(error);
            return res.status(404).send('No product found');
        }
    }

    /**
     * Delete product by id
     * @author Pierre FORQUES <pierre.forques@viacesi.fr>
     * @param {express.Request} req : query id
     * @param {express.Response} res
     * @returns {JSON}
     */
    public static async deleteById(req: express.Request, res: express.Response){
        try {
            const productFound = await product.deleteOne({ _id: req.query.id });
            if(!productFound) {
              throw new Error('No document found');
            }
            return res.send(JSON.stringify(productFound));
        } catch (error) {
            Log.error(error);
            return res.status(404).send('Cannot delete product');
        }
    }

    /**
     * Create a product
     * @author Pierre FORQUES <pierre.forques@viacesi.fr>
     * @param {express.Request} req : need a body with a product
     * @param {express.Response} res
     * @returns {JSON}
     */
    public static async createOne(req: express.Request, res: express.Response){
        try {
            const createdProduct = await new product(req.body).save();
            if(!createdProduct) {
              throw new Error('No document found');
            }
            return res.send(JSON.stringify(createdProduct));
        } catch (error) {
            Log.error(error);
            return res.send('Cannot create a new product');
        }
    }

    /**
     * Update a product
     * @author Pierre FORQUES <pierre.forques@viacesi.fr>
     * @param {express.Request} req : ???????
     * @param {express.Response} res
     * @returns {JSON}
     */
    public static async updateById(req: express.Request, res: express.Response){
        try {
            const updatableProduct = await product.findOneAndUpdate({_id: req.query.id}, req.body);
            if(!updatableProduct) {
              throw new Error('No document found');
            }
            return res.send(JSON.stringify(updatableProduct));
        } catch (error) {
            Log.error(error);
            return res.send('Cannot update a product');
        }
    }

} export default ProductController;