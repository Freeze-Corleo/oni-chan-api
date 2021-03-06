import { ObjectId } from 'mongodb';
import IRestaurant from './IRestaurant';

interface IPartner {
    name: string;
    address: string;
    siren: string;
    activity: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    userId: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    restaurants: IRestaurant[];
    uuid: string;
    status: string;
    _id: ObjectId;
}
export default IPartner;
