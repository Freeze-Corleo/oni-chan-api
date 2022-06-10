import { ObjectId } from 'mongodb';

class User {
    email: string;
    password: string;
    phone: string;
    address: Address;
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
}
