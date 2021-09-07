import * as voteService from "./vote.service";
import express from "express";
import {auth} from '../middleware/auth'

export const voteRouter = express.Router()

voteRouter.post("/", voteService.createOrUpdate);
voteRouter.put("/:id", voteService.update);
voteRouter.delete("/:id", voteService.remove);
voteRouter.delete("/comment/:id", auth, voteService.removeAllByCommentId);
voteRouter.get("/", voteService.findAll);
voteRouter.get("/:id", voteService.findOne);
voteRouter.get("/comment/:commentId", voteService.findAllByCommentId);
voteRouter.get("/user/:userId", voteService.findAllByUserId);
voteRouter.get("/note/:commentId", voteService.findNoteByCommentId);
voteRouter.get("/:userId/:commentId", voteService.findOneByUserIdAndCommentId);
