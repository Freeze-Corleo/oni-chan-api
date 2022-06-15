import mongoose from '../../providers/Database';
import IProduct from '../IProduct';
import { Schema } from 'mongoose';
import { customizationSchema } from './Customization';
import { allergicSchema } from './Allergic';

export const productSchema = new mongoose.Schema({
    title: String,
    price: Number,
    itemDescription: String,
    category: Schema.Types.ObjectId,
    imageUrl: String,
    customizationsList: [customizationSchema],
    allergic: [allergicSchema]
});

export default mongoose.model<IProduct>('product', productSchema);


