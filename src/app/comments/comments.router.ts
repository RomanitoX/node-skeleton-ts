import * as commentService from "./comments.service";
import express from "express";
import {auth} from '../middleware/auth'

export const commentRouter = express.Router()

commentRouter.post("/",commentService.create);
commentRouter.put("/:id", commentService.update);
commentRouter.delete("/:id", commentService.remove);
commentRouter.delete("/article/:id", commentService.removeAllByArticleId);
commentRouter.get("/", commentService.findAll);
commentRouter.get("/:id", commentService.findOne);
commentRouter.get("/article/:articleId", commentService.findAllByArticleId);
