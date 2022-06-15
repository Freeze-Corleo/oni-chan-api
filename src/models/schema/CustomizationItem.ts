import mongoose from '../../providers/Database';
import ICustomization from '../ICustomization';

export const customizationItemSchema = new mongoose.Schema({
    defaultQuantity: Number,
    minPermitted: Number,
    maxPermitted: Number,
    price: Number,
    title: String,
    isSoldOut: Boolean
});

export default mongoose.model<ICustomization>('customizationItem', customizationItemSchema);


