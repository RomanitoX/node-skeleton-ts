import "../lib/env"
import * as Mongoose from "mongoose";
import {mongoose} from "@typegoose/typegoose";
import {logger} from "../config/winston";

let database: Mongoose.Connection;

export function connect() {
    const uri = process.env.DATABASE_URL;
    if (database) {
        return;
    }
    mongoose.connect(uri, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true,
    }).then(r => {
    });

    database = mongoose.connection;
    database.once("open", async () => {
        logger.info('Connected to the database : ' + process.env.DATABASE_NAME)
    });
    database.on("error", () => {
        logger.error('Unable to connect to the database !')
    });
}

export function disconnect() {
    if (!database) {
        return;
    }
    Mongoose.disconnect();
}