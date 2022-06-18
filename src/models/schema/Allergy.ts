import mongoose from '../../providers/Database';
import IAllergy from '../IAllergy';

export const allergySchema = new mongoose.Schema({
    title: String
});

export default mongoose.model<IAllergy>('allergy', allergySchema);


