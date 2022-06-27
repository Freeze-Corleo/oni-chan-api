import mongoose from '../../providers/Database';
import { Schema } from 'mongoose';
import { ProductSchema } from './Product';
import IRestaurant from '../IRestaurant';

export const restaurantSchema = new mongoose.Schema({
    name: { trim: true, type: String },
    rate: { type: Number },
    deliveryPrice: { type: Number },
    address: String,
    price: { type: Number },
    cookType: { trim: true, type: String },
    products: [ProductSchema],
    isAvailable: { type: Boolean }
});

export const Restaurant = mongoose.model<IRestaurant>('Restaurant', restaurantSchema);

export default Restaurant;
