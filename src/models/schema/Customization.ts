import mongoose from '../../providers/Database';
import ICustomization from '../ICustomization';
import { Schema } from 'mongoose';

export const CustomizationSchema = new mongoose.Schema({
    maxPermitted: { required: true, type: Number },
    minPermitted: { required: true, type: Number },
    minPermittedUnique: { required: true, type: Number },
    maxPermittedUnique: { required: true, type: Number },
    title: { trim: true, type: String, lowercase: true },
    options: { type: [Schema.Types.ObjectId], ref: 'CustomizationItem' }
});

export default mongoose.model<ICustomization>('Customization', CustomizationSchema);
