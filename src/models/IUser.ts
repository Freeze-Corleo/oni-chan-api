import { ObjectId } from 'mongodb';
import IAddress from './IAddress';

interface IUser {
    email: string;
    password: string;
    phone: string;
    address: IAddress;
    createdAt: Date;
    updatedAt: Date;
    googleAuth: boolean;
    verifyUser: boolean;
    emailCode: string;
    browser: string;
    status: Status;
    godFather: ObjectId;
    profilUrl: string;
    isBanned: boolean;
    uuid: string;
} export default IUser;
