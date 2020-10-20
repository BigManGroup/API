import {Collection, MongoClient} from "mongodb";
import * as properties from '../../resources/config.json'
import DatabaseCache from "../cache/DatabaseCache";
import Quote from "./Quote";
import Insult from "./Insult";

export default class DatabaseWrapper{
    clientPool : MongoClient;
    quoteCollection : Collection;
    insultCollection : Collection;
    databaseCache : DatabaseCache;

    guildId : string;

    constructor() {
        this.guildId = properties.guildId;
        this.databaseCache = new DatabaseCache();
    }

    async initPool(){
        this.clientPool = new MongoClient(properties.database, {useUnifiedTopology: true, useNewUrlParser: true, poolSize: 15, keepAlive: true});
        await this.clientPool.connect();
        console.info("Database Connected");

        this.quoteCollection = this.clientPool.db().collection("quotes");
        this.insultCollection = this.clientPool.db().collection("insults");
    }

    async getQuotes() : Promise <Quote[]>{
        let size = (await this.quoteCollection.stats()).count;
        if(this.databaseCache.lastSize !== size) await this.buildQuoteCache();
        return Array.from(this.databaseCache.quote.values());
    }

    async getInsults() : Promise <Insult[]>{
        let size = (await this.quoteCollection.stats()).count;
        if(this.databaseCache.lastSize !== size) await this.buildInsultCache();
        return Array.from(this.databaseCache.insult.values());
    }

    private async buildQuoteCache(){
        let results = await (this.quoteCollection.find({$and: [{"accepted": true}, {"guild": "264032838712688640"}]})).toArray(); //Search where accepted is true
        this.databaseCache.lastSize = results.length;

        for (let i = 0; i !== results.length ; i++) {
            let currentQuote = Quote.modelBuilder(results[i]);
            this.databaseCache.quote.set(currentQuote._id, currentQuote);
        }
    }

    private async buildInsultCache(){
        let results = await (this.insultCollection.find({$and: [{"accepted": true}, {"guild": "264032838712688640"}]})).toArray(); //Search where accepted is true
        this.databaseCache.lastSize = results.length;

        for (let i = 0; i !== results.length ; i++) {
            let currentInsult = Insult.modelBuilder(results[i]);
            this.databaseCache.insult.set(currentInsult._id, currentInsult);
        }
    }
}

