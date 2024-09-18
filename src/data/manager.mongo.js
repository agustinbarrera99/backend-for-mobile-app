import User from "./models/users.model.js";
import Product from "./models/products.model.js";

class MongoManager {
    constructor(model) {
        this.model = model
    }
    async create(data) {
        try {
            const response = await this.model.create(data)
            return response._id
        } catch (error) {
            throw error
        }
    }
    async read({filter, sortAndPaginate}) {
        try {
            const response = await this.model.paginate(filter, sortAndPaginate)
            return response
        } catch (error) {
            throw error
        }
    }
    async readOne(id) {
        try {
            const response = await this.model.findById(id)
            if(!response) {
                const error = new Error("no se encontro el recurso!")
                error.statusCode = 404
                throw error
            }
            return response
        } catch (error) {
            throw error
        }
    }
    async readByEmail(email) {
        try {
          const one = await this.model.findOne({ email });
          return one;
        } catch (error) {
          throw error;
        }
      }
      
    async update(id, data) {
        try {
            const opt = {new: true}
            const response = await this.model.findByIdAndUpdtate(id, data, opt)
            if(!response) {
                const error = new Error("no se encontro recurso a actualizar!")
                error.statusCode = 404
                throw error
            }
            return response
        } catch (error) {
            throw error
        }
    }
    async destroy(id) {
        try {
            const response = await this.model.findByIdAndDelete(id)
            return response
         } catch (error) {
            throw error
        }
    }
}

const users = new MongoManager(User)
const products = new MongoManager(Product)

export { users, products }
