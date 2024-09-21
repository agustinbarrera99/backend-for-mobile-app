import { Router } from "express";
import { create, read, readOne, update, destroy, toggleFavoriteProduct, addComment,readLoggedUserProducts } from "../controller/products.controller.js";
import { authenticateUser } from "../middlewares/authenticateUser.mid.js";

const productsRouter = Router()

productsRouter.post("/", authenticateUser,create)
productsRouter.get("/", authenticateUser,read)
productsRouter.get("/myProducts", authenticateUser, readLoggedUserProducts)
productsRouter.get("/:pid", authenticateUser,readOne)
productsRouter.put("/:pid", authenticateUser,update)
productsRouter.delete("/:pid", authenticateUser,destroy)
productsRouter.put("/favorite/:pid", authenticateUser, toggleFavoriteProduct) 
productsRouter.post("/:pid/comments", authenticateUser, addComment);

export default productsRouter