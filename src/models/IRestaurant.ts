import { ObjectId } from 'mongodb';
import Product from './schema/Product';
import IAddress from './IAddress';
import IProduct from './IProduct';

interface IRestaurant {
    name: string;
    rate: number;
    deliveryPrice: number;
    address: string;
    price: number;
    cookType: string;
    products: IProduct[];
    isAvailable: boolean;
    _id: string;
}
export default IRestaurant;
