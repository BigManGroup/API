import Quote from "../database/Quote";
import {ObjectId} from 'mongodb'
import Insult from "../database/Insult";

export default class DatabaseCache{
    lastSize : number;
    quote : Map <ObjectId, Quote>;
    insult : Map<ObjectId, Insult>;

    constructor() {
        this.quote = new Map();
        this.insult = new Map();
    }
}