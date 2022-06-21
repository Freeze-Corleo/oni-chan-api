import ICustomization from './ICustomization';
import IAllergy from './IAllergy';
import { ObjectId } from 'bson';

interface IProduct {
    title: String;
    price: Number;
    itemDescription: String;
    category: ObjectId; //soit un objt id soit un nom et donc on le creer
    imageUrl: String;
    customizationsList: ICustomization[];
    alleric: IAllergy[];
} export default IProduct;