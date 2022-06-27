import ICustomization from './ICustomization';
import IAllergy from './IAllergy';

interface IProduct {
    title: string;
    price: number;
    itemDescription: string;
    category: string; //soit un objt id soit un nom et donc on le creer
    imageUrl: string;
    productId: string;
    customizationsList: ICustomization[];
    alleric: IAllergy[];
}
export default IProduct;
