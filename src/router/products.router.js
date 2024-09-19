import { Router } from "express";
import { create, read, readOne, update, destroy } from "../controller/products.controller.js";
import { authenticateUser } from "../middlewares/authenticateUser.mid.js";

const productsRouter = Router()

productsRouter.post("/", authenticateUser,create)
productsRouter.get("/", authenticateUser,read)
productsRouter.get("/:pid", authenticateUser,readOne)
productsRouter.put("/:pid", authenticateUser,update)
productsRouter.delete("/:pid", authenticateUser,destroy)

export default productsRouter