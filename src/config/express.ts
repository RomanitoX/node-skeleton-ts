import express = require('express');
import cors = require('cors');
import * as expressWinston from "express-winston";
import {logger, reqLogger} from "./winston";
import bodyParser from "body-parser";
import {authRouter} from "../app/auth/auth.router";
import {userRouter} from "../app/users/user.router";
import {articleRouter} from "../app/articles/articles.router";
import {commentRouter} from "../app/comments/comments.router";
import {voteRouter} from "../app/vote/vote.router";

export function startExpress() {
    const app: express.Application = express();

    app.use(expressWinston.logger(reqLogger));
    app.use(bodyParser.json());
    app.use(cors())

    const PORT = process.env.PORT;

    app.listen(PORT, () => {
        logger.log({
            level: 'info',
            message: 'App connected and listening to the port : ' + PORT
        })
    })

// ROUTES
    app.use("/auth", authRouter)
    app.use("/user", userRouter)
    app.use("/article", articleRouter)
    app.use("/comment", commentRouter)
    app.use("/vote", voteRouter)
}
