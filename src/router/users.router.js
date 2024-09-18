import { Router } from "express"
import { create, read, readOne, update, destroy } from "../controller/users.controller.js"
import { isAuth } from "../middlewares/isAuth.mid.js"
import { authenticateUser } from "../middlewares/authenticateUser.mid.js"

const usersRouter = Router()

usersRouter.post("/", create)
usersRouter.get("/", authenticateUser,isAuth,read)
usersRouter.get("/:uid", readOne)
usersRouter.put("/", update)
usersRouter.delete("/:uid", destroy)


export default usersRouter