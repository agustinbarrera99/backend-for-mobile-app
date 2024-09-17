import express from "express";
import "dotenv/config.js";
import apiRouter from "./src/router/api.router.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import { pathHandler } from "./src/middlewares/pathHandler.js";
import __dirname from "./utils.js";
import morgan from "morgan";
import { dbConnection } from "./src/utils/dbConnection.util.js";

const server = express();

const PORT = process.env.PORT || 9000;
const ready = () => {
  console.log(`server ready on ${PORT}`);
  dbConnection()
};
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(express.static(__dirname + "/public"));
server.use(morgan("dev"));
server.use("/api", apiRouter);
server.use(errorHandler);
server.use(pathHandler);
server.listen(PORT, ready);
