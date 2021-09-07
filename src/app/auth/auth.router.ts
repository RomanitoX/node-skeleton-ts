import * as authService from "./auth.service";
import express from "express";
import {auth} from "../middleware/auth";

export const authRouter = express.Router()

authRouter.post("/login", authService.generateToken);
authRouter.get("/ping", auth, authService.pingAuth);
