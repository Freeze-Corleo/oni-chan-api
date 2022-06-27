import mongoose from '../../providers/Database';
import ICustomization from '../ICustomization';

export const CustomizationItemSchema = new mongoose.Schema({
    defaultQuantity: { required: true, type: Number },
    minPermitted: { required: true, type: Number },
    maxPermitted: { required: true, type: Number },
    price: { required: true, type: Number },
    title: { required: true, type: String },
    isSoldOut: { required: true, type: Boolean }
});

export default mongoose.model<ICustomization>(
    'CustomizationItem',
    CustomizationItemSchema
);
