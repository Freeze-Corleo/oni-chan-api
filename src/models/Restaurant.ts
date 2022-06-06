import { ObjectId } from "mongodb";
import {Product} from "./Product";

class Restaurant{
    name:string;
    rate:number;
    deliveryPrice:number;
    address: Address;
    price:Enumerator;
    cookType: ObjectId;
    products: Product[];
    isAvailable: boolean;
    uuid: string;
}
export {Restaurant}