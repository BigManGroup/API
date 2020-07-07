import {ObjectId} from 'mongodb'

export default class Quote {
    _id: ObjectId;
    readonly guild: string;
    readonly quoteText: string;
    readonly quoteYear: string;
    readonly quoteUser: string;
    message: string;
    readonly user: string;
    readonly submittedTimestamp: Date;
    updatedTimestamp: Date;
    accepted: boolean;
    pending: boolean;

    constructor(quoteText: string, quoteYear: string, quoteUser: string, guild: string, message: string, user: string, timestamp: Date, accepted: boolean, pending: boolean) {
        this.quoteText = quoteText;
        this.quoteYear = quoteYear;
        this.quoteUser = quoteUser;
        this.guild = guild;
        this.message = message;
        this.user = user;
        this.submittedTimestamp = timestamp;
        this.accepted = accepted;
        this.pending = pending;
    }

    static modelBuilder(object: any): Quote {
        let quote = new Quote(object.quoteText, object.quoteYear, object.quoteUser, object.guild, object.message, object.user, object.submittedTimestamp, object.accepted, object.pending);
        if (object._id !== undefined) quote._id = new ObjectId(object._id);
        else quote._id = new ObjectId();
        return quote;
    }

    toString(): object {
        return {
            _id: this._id,
            quoteText: this.quoteText,
            quoteYear: this.quoteYear,
            quoteUser: this.quoteUser,
            guild: this.guild,
            message: this.message,
            user: this.user,
            submittedTimestamp: this.submittedTimestamp,
            updatedTimestamp: this.updatedTimestamp,
            accepted: this.accepted,
            pending: this.pending
        }
    }
}