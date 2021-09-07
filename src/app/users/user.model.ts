import {modelOptions, prop} from "@typegoose/typegoose";

@modelOptions({schemaOptions: {timestamps: true}})
export class User {

    @prop({required: true, unique: true, trim: true})
    email!: string;

    @prop({required: true, trim: true, select: false})
    password!: string;

    @prop({required: true, trim: true})
    name!: string;

    @prop({required: true})
    age!: number;

    @prop({required: true, enum: ['male', 'female', 'other', 'tractopelle']})
    gender!: UserGender;

    @prop({required: true, default: true, select: false})
    isActive!: boolean;

    @prop({required: true, default: "admin", enum: ['admin', 'user'], select: false})
    userType!: UserType;
}

export enum UserGender {
    GENDER_MALE = "male",
    GENDER_FEMALE = "female",
    GENDER_TRACTOPELE = "tractopele",
    GENDER_OTHER = "other"
}

export enum UserType {
    ADMIN = "admin",
    USER = "user"
}
