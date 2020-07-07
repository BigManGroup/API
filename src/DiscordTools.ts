import * as Discord from 'discord.js'
import * as properties from '../resources/config.json'
import UsernameCache from "./cache/UsernameCache";

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
        let guildMember = this.client.guilds.cache.get(this.guildId).members.cache.get(userId);
        if (guildMember.partial) await guildMember.fetch();

        let nickname = guildMember.nickname;
        if(guildMember.nickname === null || guildMember.nickname === undefined) nickname = guildMember.user.username;
        else if(guildMember.deleted) nickname = "Deleted User";
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
