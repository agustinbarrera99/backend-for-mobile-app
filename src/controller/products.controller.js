import { products } from "../data/manager.mongo.js";
import jwt from "jsonwebtoken";
import { users } from "../data/manager.mongo.js";
import User from "../data/models/users.model.js";

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
      const token = req.headers.authorization?.split(" ")[1];
      const userData = jwt.verify(token, process.env.SECRET_KEY); // Obtener los datos del usuario desde el token

      const sortAndPaginate = {
        limit: req.query.limit || 12,
        page: req.query.page || 1,
        sort: { user_name: 1 },
      };
      const filter = { ownerId: { $ne: userData._id } };

      if (req.query.name) {
        filter.name = new RegExp(req.query.name.trim(), "i");
      }

      const response = await this.controller.read({ filter, sortAndPaginate });
      if (response.docs.length === 0) {
        return res.json({
          statusCode: 404,
          message: "No se encontró ningún producto!",
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
  readLoggedUserProducts = async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const userData = jwt.verify(token, process.env.SECRET_KEY);

      const sortAndPaginate = {
        limit: req.query.limit || 12,
        page: req.query.page || 1,
        sort: { user_name: 1 },
      };
      const filter = { ownerId: { $eq: userData._id } };

      if (req.query.name) {
        filter.name = new RegExp(req.query.name.trim(), "i");
      }

      const response = await this.controller.read({ filter, sortAndPaginate });
      if (response.docs.length === 0) {
        return res.json({
          statusCode: 404,
          message: "No se encontró ningún producto!",
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
      const data = req.body;
      const token = req.headers.authorization?.split(" ")[1];
      const userData = jwt.verify(token, process.env.SECRET_KEY);
      const product = await this.controller.readOne(pid);
      if (
        userData.role === 1 ||
        product.ownerId._id.toString() === userData._id.toString()
      ) {
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
      if (
        userData.role === 1 ||
        product.ownerId._id.toString() === userData._id.toString()
      ) {
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
  toggleFavoriteProduct = async (req, res, next) => {
    try {
        const { pid } = req.params;
        const token = req.headers.authorization?.split(" ")[1];
        const userData = jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findById(userData._id).populate("favoriteProducts");

        if (!user) {
            return res.json({
                statusCode: 401,
                message: "Bad Auth!",
            });
        }

        const product = await this.controller.readOne(pid);
        if (!product) {
            return res.json({
                statusCode: 404,
                message: "Producto no encontrado.",
            });
        }

        const isFavorite = user.favoriteProducts.some(
            (productItem) => productItem._id.toString() === pid
        );

        if (isFavorite) {
            user.favoriteProducts = user.favoriteProducts.filter(
                (productItem) => productItem._id.toString() !== pid
            );
        } else {
            user.favoriteProducts.push(product._id);
        }

        await user.save();

        await user.populate("favoriteProducts");

        return res.json({
            statusCode: 200,
            message: isFavorite
                ? "Producto eliminado de favoritos."
                : "Producto añadido a favoritos.",
            favoriteProducts: user.favoriteProducts,
        });
    } catch (error) {
        next(error);
    }
};
  addComment = async (req, res, next) => {
    try {
      const { pid } = req.params;
      const { text } = req.body;

      const token = req.headers.authorization?.split(" ")[1];
      const userData = jwt.verify(token, process.env.SECRET_KEY);

      if (!text || text.trim() === "") {
        return res.json({
          statusCode: 400,
          message: "El comentario no puede estar vacío",
        });
      }

      const product = await this.controller.readOne(pid);
      if (!product) {
        return res.json({
          statusCode: 404,
          message: "Producto no encontrado.",
        });
      }

      product.comments.push({
        userId: userData._id,
        text: text.trim(),
        date: new Date().toLocaleDateString(),
      });

      await product.save();

      return res.json({
        statusCode: 200,
        message: "Comentario agregado con éxito",
        product,
      });
    } catch (error) {
      next(error);
    }
  };
}

const productsController = new UsersController(products);

export const {
  create,
  read,
  readOne,
  update,
  destroy,
  toggleFavoriteProduct,
  addComment,
  readLoggedUserProducts
} = productsController;
