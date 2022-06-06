import { ObjectId } from "mongodb";
import { Restaurant } from "./Restaurant";

class Partner {
    name:string;
    address:Address;
    siren:string;
    activity:string;
    firstname:string;
    lastname:TimeRanges;
    userId:ObjectId;
    restaurants: Restaurant[];
    uuid:string;
}