import usersRouter from "./users.router.js";
import productsRouter from "./products.router.js";
import { Router } from "express"

const apiRouter = Router()

apiRouter.use("/users", usersRouter)
apiRouter.use("/products", productsRouter)

export default apiRouter