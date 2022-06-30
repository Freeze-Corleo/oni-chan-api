import mongoose from '../../providers/Database';
import { Schema } from 'mongoose';
import ICommand from '../ICommand';

export const commandSchema = new mongoose.Schema({
    price: { type: Number },
    products: { type: [Schema.Types.ObjectId], ref: 'Product' },
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant' },
    address: String,
    delivery: { type: Schema.Types.ObjectId, ref: 'User' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    isAccepted: { type: Boolean },
    isRecieved: { type: Boolean },
    uuid: { type: String },
    deleted: { type: Boolean },
    createdAt: { type: Date }
});

export const Command = mongoose.model<ICommand>('Command', commandSchema);

export default Command;
