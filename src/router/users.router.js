import { Router } from "express"
import { create, read, readOne, update, destroy } from "../controller/users.controller.js"

const usersRouter = Router()

usersRouter.post("/", create)
usersRouter.get("/", read)
usersRouter.get("/:uid", readOne)
usersRouter.put("/", update)
usersRouter.delete("/", destroy)


export default usersRouter