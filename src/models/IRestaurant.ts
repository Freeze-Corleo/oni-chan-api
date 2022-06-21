import { ObjectId } from "mongodb";
import Product from "./schema/Product";
import IAddress from './IAddress'
import IProduct from './IProduct'

interface IRestaurant{
    name:string;
    rate:number;
    deliveryPrice:number;
    address: IAddress;
    price:Enumerator;
    cookType: ObjectId;
    products: IProduct[];
    isAvailable: boolean;
    uuid: string;
} export default IRestaurant;