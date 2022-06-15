import mongoose from '../../providers/Database';
import IAllergic from '../IAllergic';

export const allergicSchema = new mongoose.Schema({
    title: String
});

export default mongoose.model<IAllergic>('allergic', allergicSchema);


