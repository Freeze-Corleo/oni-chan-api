import mongoose from '../../providers/Database';
import ICategory from '../ICategory';
import { Schema } from 'mongoose';

export const categoryProductSchema = new mongoose.Schema({
    title: { trim: true, required: true, type: String },
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant' }
});

const CategoryProduct = mongoose.model<ICategory>(
    'CategoryProduct',
    categoryProductSchema
);

export default CategoryProduct;
