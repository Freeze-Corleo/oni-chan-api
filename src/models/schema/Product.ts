import mongoose from '../../providers/Database';
import IProduct from '../IProduct';

export const productSchema = new mongoose.Schema({
    title: String,
    price: Number,
    itemDescription: String,
    //category: ObjectId;
    imageUrl: String,
    //customizationsList: Customization[];
    //allergic: Allergic[];
    uuid: String
});

export default mongoose.model<IProduct>('Product', productSchema);


