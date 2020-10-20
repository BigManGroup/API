import DatabaseWrapper from "./database/DatabaseWrapper";
import DiscordTools from "./DiscordTools";
import * as http from "http";
import {getRandomNumber} from "./Tools";
import {ServerResponse} from "http";

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

    async randomQuote(res : ServerResponse) : Promise <void>{
        let quotes = await this.databaseWrapper.getQuotes();
        let quote = quotes[getRandomNumber(0, quotes.length-1)]

        let formattedQuote = {
            text: quote.quoteText,
            year: quote.quoteYear,
            nickname: await this.discordTools.getUsername(quote.quoteUser)
        }

        res.writeHead(200, {
            'Content-Length': JSON.stringify(formattedQuote).length,
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Request-Method': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': '*'
        });

        res.end(JSON.stringify(formattedQuote));
    }

    async randomInsult(res : ServerResponse){
        let insults = await this.databaseWrapper.getInsults();
        let insult = insults[getRandomNumber(0, insults.length-1)];

        let formattedInsult = {
            insult: insult.insult
        }

        res.writeHead(200, {
            'Content-Length': JSON.stringify(formattedInsult).length,
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Request-Method': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': '*'
        });

        res.end(JSON.stringify(formattedInsult));
    }

    startRestServer(){
        this.server = http.createServer(async (req, res) => {
            if(req.url === "/favicon.ico") {
                res.writeHead(204);
                res.end();
                return;
            }else if(req.url === "/randomquote") await this.randomQuote(res);
            else if(req.url === "/randominsult") await this.randomInsult(res);
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