import mongoose from '../../providers/Database';
import ICategory from '../ICategory';

export const categoryProductSchema = new mongoose.Schema({
    title: String
});

export default mongoose.model<ICategory>('categoryproduct', categoryProductSchema);


