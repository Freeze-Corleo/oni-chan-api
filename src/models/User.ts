import { ObjectId } from "mongodb";

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
    isPartner: boolean;
    isDeliver: boolean;
    godFather: ObjectId;
    profilUrl: string;
    isBanned: boolean;
    uuid: string;

}