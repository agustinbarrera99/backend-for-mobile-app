import { Router } from "express";
import { register, login, signout } from "../controller/sessions.controller.js";
import { authenticateUser } from "../middlewares/authenticateUser.mid.js";

const sessionsRouter = Router()

sessionsRouter.post("/register",register)
sessionsRouter.post("/login", login)
sessionsRouter.post("/signout",authenticateUser,signout)

export default sessionsRouter