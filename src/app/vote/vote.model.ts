import {modelOptions, prop} from "@typegoose/typegoose";

@modelOptions({schemaOptions: {timestamps: true}})
export class Vote {

    @prop({required: true, trim: true})
    public commentId: string;

    @prop({required: true, trim: true})
    public userId: string;

    @prop({enum: ['down', 'up']})
    public voteType: VoteType;
}

export enum VoteType {
    VOTETYPE_DOWN = 'down',
    VOTETYPE_UP = 'up'
}
