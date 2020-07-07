import {Collection, MongoClient} from "mongodb";
import * as properties from '../../resources/config.json'
import DatabaseCache from "../cache/DatabaseCache";
import Quote from "./Quote";

export default class DatabaseWrapper{
    clientPool : MongoClient;
    collection : Collection;
    databaseCache : DatabaseCache;

    guildId : string;

    constructor() {
        this.guildId = properties.guildId;
        this.databaseCache = new DatabaseCache();
    }

    async initPool(){
        this.clientPool = new MongoClient(properties.database, {useUnifiedTopology: true, useNewUrlParser: true, poolSize: 15, keepAlive: true});
        await this.clientPool.connect();
        this.collection = this.clientPool.db().collection("quotes;")
    }

    async getQuotes() : Promise <Quote[]>{
        let size = (await this.collection.stats()).size;
        if(this.databaseCache.lastSize !== size) await this.buildQuoteCache();

        return Array.from(this.databaseCache.quote.values());
    }

    private async buildQuoteCache(){
        console.info("Cache mismatch - Rebuilding Cache")
        let results = await (this.collection.find({$and: [{"accepted": true}, {"guild": "264032838712688640"}]})).toArray(); //Search where accepted is true
        this.databaseCache.lastSize = results.length;

        for (let i = 0; i !== results.length ; i++) {
            let currentQuote = Quote.modelBuilder(results[i]);
            this.databaseCache.quote.set(currentQuote._id, currentQuote);
        }
    }
}

