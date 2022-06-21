import { ObjectId } from "mongodb";
import IRestaurant from "./IRestaurant";
import IAddress from './IAddress';

interface IPartner {
    name:string;
    address:IAddress;
    siren:string;
    activity:string;
    firstname:string;
    lastname:TimeRanges;
    userId:ObjectId;
    restaurants: IRestaurant[];
    uuid:string;
} export default IPartner;