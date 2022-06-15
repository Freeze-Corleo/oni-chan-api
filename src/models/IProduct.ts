import ICustomization from './ICustomization';
import IAllergic from './IAllergic';
import { ObjectId } from 'bson';

interface IProduct {
    title: String;
    price: Number;
    itemDescription: String;
    category: ObjectId;
    imageUrl: String;
    customizationsList: ICustomization[];
    alleric: IAllergic[];
} export default IProduct;