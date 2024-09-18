import { users } from "../data/manager.mongo.js";
import { hashPassword } from "../utils/hashPssword.util.js";

class UsersController {
  constructor(model) {
    this.controller = model;
  }
  create = async (req, res, next) => {
    try {
      const data = req.body
      let { password } = req.body
      const hashedPassword = await hashPassword(password)
      const response = await this.controller.create({...data, password: hashedPassword})
      return res.json({
          statusCode: 201,
          response
      })
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
      if (req.query.username) {
        filter.username = new RegExp(req.query.userName.trim(), "i");
      }
      const response = await this.controller.read({ filter, sortAndPaginate });
      if (response.docs.length === 0) {
        const error = new Error("no se encontraron usuarios!")
        error.statusCode = 404
        throw error
      }
      return res.json({
        statusCode: 200,
        response
      })
    } catch (error) {
      next(error);
    }
  };
  readOne = async (req, res, next) => {
    try {
      const response = await this.controller.readOne(id);
      return res.json({
        statusCode: 200,
        response
      })
    } catch (error) {
      next(error);
    }
  };
  update = async (req, res, next) => {
    try {
      const response = await this.controller.update(id, data);
      return res.json({
        statusCode: 200,
        response
      })
    } catch (error) {
      return next(error);
    }
  };
  destroy = async (req, res, next) => {
    try {
      let { uid } = req.params
      const response = await this.controller.destroy(uid);
      if(!response){
        const error = new Error("no se encontro el usuario a eliminar!")
        error.statusCode = 404
        throw error
    }
      return res.json({
        statusCode: 200,
        response
      });
    } catch (error) {
      next(error);
    }
  };
}

const usersController = new UsersController(users);

export const { create, read, readOne, update, destroy } = usersController;
