import mongoose from '../../providers/Database';
import ICategory from '../ICategory';

export const categoryProductSchema = new mongoose.Schema({
    title: String
});

const CategoryRestaurant = mongoose.model<ICategory>(
    'CategoryRestaurant',
    categoryProductSchema
);

export default CategoryRestaurant;
