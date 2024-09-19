import { Router } from "express"
import { create, read, readOne, update, destroy } from "../controller/users.controller.js"
import { authenticateUser } from "../middlewares/authenticateUser.mid.js"
import { isAdmin } from "../middlewares/isAdmin.mid.js"

const usersRouter = Router()

usersRouter.post("/", isAdmin,create)
usersRouter.get("/", authenticateUser,read)
usersRouter.get("/:uid", authenticateUser,readOne)
usersRouter.put("/", isAdmin,update)
usersRouter.delete("/:uid", isAdmin,destroy)

export default usersRouter