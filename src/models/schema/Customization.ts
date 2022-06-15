import mongoose from '../../providers/Database';
import ICustomization from '../ICustomization';
import { customizationItemSchema } from './CustomizationItem'

export const customizationSchema = new mongoose.Schema({
    maxPermitted: Number,
    minPermitted: Number,
    minPermittedUnique: Number,
    maxPermittedUnique: Number,
    title: String,
    options: [customizationItemSchema]
});

export default mongoose.model<ICustomization>('customization', customizationSchema);


