import { ObjectId } from "mongodb";

interface IBankAccount{
    amount: number;
    uuid: string;
    deliveryManId: ObjectId;
    restaurantId: ObjectId;
} export default IBankAccount;