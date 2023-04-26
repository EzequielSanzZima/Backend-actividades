import {ObjectId} from "../../deps.ts";

export interface Product {
    _id: ObjectId;
    name: string;
    price: number;
    thumbnail: string;
}