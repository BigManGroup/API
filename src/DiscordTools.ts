import * as Discord from 'discord.js'
import * as properties from '../resources/config.json'
import UsernameCache from "./cache/UsernameCache";
import {GuildMember} from "discord.js";

export default class DiscordTools{
    readonly guildId : string;
    readonly client : Discord.Client;
    readonly usernameCache : UsernameCache;

    constructor() {
        this.guildId = properties.guildId;
        this.client = new Discord.Client();
        this.usernameCache = new UsernameCache();
    }

    async getUsername(userId : string) : Promise <string> {
        if(!this.usernameCache.isCacheExpired(userId)) return this.usernameCache.userCache.get(userId);


        let guildMember : GuildMember = this.client.guilds.cache.get(this.guildId).members.cache.get(userId);
        if (guildMember === undefined || guildMember.partial) guildMember = await this.client.guilds.cache.get(this.guildId).members.fetch(userId)

        let nickname = "";
        if(guildMember === undefined) nickname = "GBNF";
        else if(guildMember.nickname === null || guildMember.nickname === undefined) nickname = guildMember.user.username;
        else if(guildMember.deleted) nickname = "Deleted User";
        else nickname = guildMember.nickname;

        this.usernameCache.updateCache(userId, nickname);

        return nickname;
    }

    loginClient() : Promise <void>{
        return new Promise<void>(async (resolve) => {
            await this.client.login(properties.token);
            this.client.on('ready', () => {
                console.info("Discord Client Started")
                resolve();
            });
        });
    }
}
