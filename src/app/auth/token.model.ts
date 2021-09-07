import {modelOptions, prop} from "@typegoose/typegoose";

@modelOptions({schemaOptions: {timestamps: true}})
export class Token {

    @prop({unique: true, required: true, trim: true, expires: '1d'})
    token!: string;
}
