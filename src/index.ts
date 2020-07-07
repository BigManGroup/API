import DatabaseWrapper from "./database/DatabaseWrapper";
import DiscordTools from "./DiscordTools";
import * as http from "http";
import {getRandomNumber} from "./Tools";

class Runner{
    discordTools : DiscordTools;
    databaseWrapper : DatabaseWrapper;
    server : http.Server;

    constructor() {
        this.discordTools = new DiscordTools();
        this.databaseWrapper = new DatabaseWrapper();
    }

    async init(){
        await this.discordTools.loginClient();
        await this.databaseWrapper.initPool();
    }

    startRestServer(){
        this.server = http.createServer(async (req, res) => {
            let quotes = await this.databaseWrapper.getQuotes();
            let quote = quotes[getRandomNumber(0, quotes.length-1)]

            let formattedQuote = {
                text: quote.quoteText,
                year: quote.quoteYear,
                nickname: await this.discordTools.getUsername(quote.quoteUser)
            }

            res.writeHead(200, {'Content-Length': JSON.stringify(formattedQuote).length, 'Content-Type': 'application/json'});
            res.end(JSON.stringify(formattedQuote));
        });

        this.server.listen(3453);
        console.info("HTTP Server Started")
    }
}

let runner = new Runner();
runner.init()
    .then(() => runner.startRestServer())
    .then(() => console.info("Started"))
    .catch(error => console.log("Error while starting " + error));