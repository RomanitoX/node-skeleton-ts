import * as userService from "./user.service";
import express from "express";
import {auth} from '../middleware/auth'

export const userRouter = express.Router()

userRouter.post("/", userService.create);
userRouter.put("/:id", auth, userService.update);
userRouter.delete("/:id", userService.remove);
userRouter.get("/", userService.findAll);
userRouter.get("/:id", userService.findOne);
