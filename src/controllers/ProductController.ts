import mongoose, { Schema, model, connect } from 'mongoose';
import express from 'express';
import product from '../models/schema/Product';
import Log from '../middlewares/Log';
import { ApiError } from '../../types';

class ProductController{
    public static async getAll(req, res){  
        const allProduct = await product.find({}).exec();
        return res.send(JSON.stringify(allProduct));
    }

    public static async getById(req, res){
        const productFound = await product.findById(req.query.id).exec();
        return res.send(JSON.stringify(productFound));
    }

    public static async deleteById(req, res){
        const productFound = await product.deleteOne(req.query.id._id);
        return res.send(JSON.stringify(productFound));
    }

    public static async createOne(req: express.Request, res: express.Response){
        console.log(req)

        const product1 = new product({ 
            title: 'req.body.title',
            price: 567,
            itemDescription: 'req.body.itemDescription',
            imageUrl: 'req.body.imageUrl'
        });

       // const product1 = new Product(req.body);
        let createdProduct = await product1.save();
        return res.send("uuuii");

    }

} export default ProductController;