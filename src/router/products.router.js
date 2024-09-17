import { Router } from "express";
import { create, read, readOne, update, destroy } from "../controller/products.controller.js";

const productsRouter = Router()

productsRouter.post("/", create)
productsRouter.get("/", read)
productsRouter.get("/:pid", readOne)
productsRouter.put("/", update)
productsRouter.delete("/", destroy)

export default productsRouter