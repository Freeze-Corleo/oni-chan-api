import mongoose from '../../providers/Database';
import { Schema } from 'mongoose';
import { ProductSchema } from './Product';
import ICommand from '../ICommand';

export const commandSchema = new mongoose.Schema({
    price: { type: Number },
    products: [ProductSchema],
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant' },
    address: String,
    delivery: { type: Schema.Types.ObjectId },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    isAccepted: { type: Boolean },
    isRecieved: { type: Boolean },
    uuid: { type: String },
    deleted: { type: Boolean }
});

export const Command = mongoose.model<ICommand>('Command', commandSchema);

export default Command;
