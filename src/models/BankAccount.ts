import { ObjectId } from "mongodb";

class BankAccount{
    amount: number;
    uuid: string;
    deliveryManId: ObjectId;
    restaurantId: ObjectId;
}