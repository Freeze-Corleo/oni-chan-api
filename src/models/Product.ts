import { ObjectId } from "mongodb";

class Product{
    title: string;
    price: number;
    itemDescription: string;
    category: ObjectId;
    imageUrl: string;
    customizationsList: Customization[];
    allergic: Allergic[];
    uuid: string;
}
export {Product}