import Quote from "../database/Quote";
import {ObjectId} from 'mongodb'

export default class DatabaseCache{
    lastSize : number;
    quote : Map <ObjectId, Quote>;

    constructor() {
        this.quote = new Map();
    }
}