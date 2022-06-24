import mongoose from '../../providers/Database';
import { Schema } from 'mongoose';
import { productSchema } from './Product';
import IRestaurant from '../IRestaurant';

export const restaurantSchema = new mongoose.Schema({
    name: String,
    rate: Number,
    deliveryPrice: Number,
    address: String,
    price: Number,
    cookType: Schema.Types.ObjectId,
    products: [productSchema],
    isAvailable: Boolean,
    uuid: String
});

export default mongoose.model<IRestaurant>('restaurant', restaurantSchema);
