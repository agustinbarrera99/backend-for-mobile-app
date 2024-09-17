import { products } from "../data/manager.mongo.js";

class UsersController {
  constructor(model) {
    this.controller = model;
  }
  create = async (req, res, next) => {
    try {
      const data = req.body;
      const response = await this.controller.create(data);
      response;
    } catch (error) {
      next(error);
    }
  };
  read = async (req, res, next) => {
    try {
      const sortAndPaginate = {
        limit: req.query.limit || 12,
        page: req.query.page || 1,
        sort: { user_name: 1}
      }
      const filter = {}
      if(req.query.name) {
        filter.name = new RegExp(req.query.name.trim(), 'i')
      }
      const response = await this.controller.read({ filter, sortAndPaginate });
      return response;
    } catch (error) {
      next(error);
    }
  };
  readOne = async (req, res, next) => {
    try {
      const response = await this.controller.readOne(id);
      return response;
    } catch (error) {
      next(error);
    }
  };
  update = async (req, res, next) => {
    try {
      const response = await this.controller.update(id, data);
      return response;
    } catch (error) {
      return next(error);
    }
  };
  destroy = async (req, res, next) => {
    try {
      const response = await this.controller.destroy(id);
      return response;
    } catch (error) {
      next(error);
    }
  };
}

const productsController = new UsersController(products);

export const { create, read, readOne, update, destroy } = productsController;
