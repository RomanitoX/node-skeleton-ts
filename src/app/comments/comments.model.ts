import {modelOptions, prop} from "@typegoose/typegoose";

@modelOptions({schemaOptions: {timestamps: true}})
export class Comment {

    @prop({required: true, trim: true})
    articleId: string;

    @prop({required: true, trim: true})
    userId: string;

    @prop({required: true, trim: true})
    content: string;

    @prop({required: true})
    note: number;
}
