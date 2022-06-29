import { ObjectId } from 'mongodb';
import IProduct from './IProduct';

interface ICommand {
    price: number;
    products: IProduct[];
    restaurantId: ObjectId;
    address: string;
    delivery: ObjectId;
    userId: ObjectId;
    isAccepted: boolean;
    isRecieved: boolean;
    uuid: string;
    deleted: boolean;
}
export default ICommand;
