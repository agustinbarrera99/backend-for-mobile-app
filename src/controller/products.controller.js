import { products } from "../data/manager.mongo.js";
import jwt from "jsonwebtoken";

class UsersController {
  constructor(model) {
    this.controller = model;
  }
  create = async (req, res, next) => {
    try {
      const data = req.body;
      const token = req.headers.authorization?.split(" ")[1];
      const userData = jwt.verify(token, process.env.SECRET_KEY);
      const response = await this.controller.create({
        ...data,
        ownerId: userData._id,
      });

      if (!response) {
        return res.status.json({
          statusCode: 400,
          message: "Hubo un error al publicar el producto.",
        });
      }
      return res.json({
        statusCode: 201,
        message: "Producto publicado con éxito!",
      });
    } catch (error) {
      next(error);
    }
  };
  read = async (req, res, next) => {
    try {
      const sortAndPaginate = {
        limit: req.query.limit || 12,
        page: req.query.page || 1,
        sort: { user_name: 1 },
      };
      const filter = {};
      if (req.query.name) {
        filter.name = new RegExp(req.query.name.trim(), "i");
      }
      const response = await this.controller.read({ filter, sortAndPaginate });
      if (response.docs.length === 0) {
        return res.json({
          statusCode: 404,
          message: "no se encontro ningun producto!",
        });
      }
      return res.json({
        statusCode: 200,
        response,
      });
    } catch (error) {
      next(error);
    }
  };
  readOne = async (req, res, next) => {
    try {
      const { pid } = req.params;
      const response = await this.controller.readOne(pid);
      if (!response) {
        return res.json({
          statusCode: 404,
          message: "no se encontro el producto seleccionado!",
        });
      }
      return res.json({
        statusCode: 200,
        response,
      });
    } catch (error) {
      next(error);
    }
  };
  update = async (req, res, next) => {
    try {
      const { pid } = req.params;
      const data = req.body
      const token = req.headers.authorization?.split(" ")[1];
      const userData = jwt.verify(token, process.env.SECRET_KEY);
      const product = await this.controller.readOne(pid);
      if (userData.role === 1 || product.ownerId._id.toString() === userData._id.toString()) {
        const response = await this.controller.update(pid, data);
        return res.json({
          statusCode: 200,
          message: "producto actualizado!",
          response,
        });
      }
      return res.json({
        statusCode: 403,
        message: "no puedes eliminar editar productos de otros usuarios!",
      });
    } catch (error) {
      next(error);
    }
  };
  destroy = async (req, res, next) => {
    try {
      const { pid } = req.params;
      const token = req.headers.authorization?.split(" ")[1];
      const userData = jwt.verify(token, process.env.SECRET_KEY);
      const product = await this.controller.readOne(pid);
      console.log(product);
      if (userData.role === 1 || product.ownerId._id.toString() === userData._id.toString()) {
        const response = await this.controller.destroy(pid);
        return res.json({
          statusCode: 200,
          message: "producto eliminado!",
          response,
        });
      }
      return res.json({
        statusCode: 403,
        message: "no puedes eliminar productos de otros usuarios!",
      });
    } catch (error) {
      next(error);
    }
  };
}

const productsController = new UsersController(products);

export const { create, read, readOne, update, destroy } = productsController;
