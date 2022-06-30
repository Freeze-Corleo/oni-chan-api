import { ObjectId } from 'mongodb';
import IProduct from './IProduct';

interface ICommand {
    price: number;
    products: IProduct[];
    restaurantId: ObjectId;
    address: string;
    delivery: string;
    userId: string;
    isAccepted: boolean;
    isRecieved: boolean;
    uuid: string;
    deleted: boolean;
    createdAt: Date;
}
export default ICommand;
