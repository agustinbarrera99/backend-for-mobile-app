import { Router } from "express"
import usersRouter from "./users.router.js";
import productsRouter from "./products.router.js";
import sessionsRouter from "./sessions.router.js";

const apiRouter = Router()

apiRouter.use("/users", usersRouter)
apiRouter.use("/products", productsRouter)
apiRouter.use("/sessions", sessionsRouter)

export default apiRouter