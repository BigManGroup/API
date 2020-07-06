import * as http from "http";
import {MongoClient} from "mongodb";
import * as properties from '../resources/config.json'
import Quote from "./Quote";
import * as Discord from 'discord.js';

async function runner() {
    let clientPool: MongoClient = await new MongoClient(properties.database, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        poolSize: 15,
        keepAlive: true
    }).connect();

    let server = http.createServer(async (req, res) => {
        let quotes = await getApprovedQuotes(clientPool);
        let quote =  (Array.from(quotes.values()))[getRandomNumber(0, quotes.size-1)];

        let formattedQuote = quote.quoteText + " - " + quote.quoteYear + " " + await getUsername(quote.quoteUser);

        res.writeHead(200, {'Content-Length': formattedQuote.length, 'Content-Type': 'text/plain'});
        res.end(formattedQuote);
    });

    server.listen(3453);

    //TODO Implement caching
}

async function getApprovedQuotes(clientPool : MongoClient): Promise<Map<string, Quote>> {
    let results = await (clientPool.db().collection("quotes").find({$and: [{"accepted": true}, {"guild": "264032838712688640"}]})).toArray(); //Search where accepted is true

    let formattedResults: Map<string, Quote> = new Map<string, Quote>();
    for (let i = 0; i !== results.length; i++) {
        let currentQuote = Quote.modelBuilder(results[i]);
        formattedResults.set(currentQuote.message, currentQuote);
    }

    return formattedResults;
}

async function getUsername(id : string) : Promise <string>{
    let user = await client.guilds.cache.get("264032838712688640").member(id).fetch();
    return user.nickname;
}

function getRandomNumber(minimum: number, maximum: number): number {
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}

const client = new Discord.Client();
client.login(properties.token).then(() => runner())