import * as articleService from "./articles.service";
import express from "express";
import {auth} from '../middleware/auth'

export const articleRouter = express.Router()

articleRouter.post("/", auth, articleService.create);
articleRouter.put("/:id", auth, articleService.update);
articleRouter.delete("/:id", articleService.remove);
articleRouter.get("/", articleService.findAll);
articleRouter.get("/:id", articleService.findOne);
articleRouter.get("/published", articleService.findAllPublished);
