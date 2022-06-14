import { ObjectId } from "mongodb";
import Product from "./schema/Product";

class Restaurant{
    name:string;
    rate:number;
    deliveryPrice:number;
    address: Address;
    price:Enumerator;
    cookType: ObjectId;
    //products: Product[];
    isAvailable: boolean;
    uuid: string;
}
export {Restaurant}