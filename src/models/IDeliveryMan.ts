import { ObjectId } from "mongodb";

interface IDeliveryMan{
    userId: ObjectId;
    rate: number;
    deliveryNumber: string;
    uuid: string;
} export default IDeliveryMan;