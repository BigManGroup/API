export default class UsernameCache {
    userCache : Map <string, string>;
    userCacheDate : Map <string, Date>

    constructor() {
        this.userCache = new Map<string, string>();
        this.userCacheDate = new Map<string, Date>();
    }

    isCacheExpired(userId : string) : boolean{
        let currentDate = new Date();
        if (this.userCacheDate.get(userId) === undefined) return true; //If there is no entry, cache is automatically invalid

        if (currentDate.getTime() - this.userCacheDate.get(userId).getTime() > 172800000) {
            console.info("more than 2 days - invalid");
            return true;
        }

        return false;
    }

    updateCache(userId: string, nickname: string){
        this.userCache.set(userId, nickname);
        this.userCacheDate.set(userId, new Date());
    }
}