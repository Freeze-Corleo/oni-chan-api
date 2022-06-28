import mongoose from '../../providers/Database';
import IProduct from '../IProduct';
import { Schema } from 'mongoose';

export const ProductSchema = new mongoose.Schema({
    title: { trim: true, type: String, required: true, lowercase: true },
    price: { type: Number, required: true },
    itemDescription: { type: String, required: true, lowercase: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    imageUrl: { type: String },
    productId: { type: String },
    customizationsList: { type: [Schema.Types.ObjectId], ref: 'Customization' }
});

const Product = mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
