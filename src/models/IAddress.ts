import IUser from './IUser';

interface IAddress {
    street: string;
    number: string;
    city: string;
    zipCode: string;
    uuid: string;
    User?: IUser;
    userId?: string;
}
export default IAddress;
