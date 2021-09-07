import {modelOptions, prop} from "@typegoose/typegoose";

@modelOptions({schemaOptions: {timestamps: true}})
export class Article {

    @prop({required: true, default: false})
    public published!: boolean;

    @prop({required: true, maxlength: 256, trim: true})
    public title!: string;

    @prop({required: true, trim: true})
    public content!: string;

    @prop({required: true, trim: true})
    public userId!: string;
}
