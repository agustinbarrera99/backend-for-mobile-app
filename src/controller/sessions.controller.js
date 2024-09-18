import { users } from "../data/manager.mongo.js";
import { hashPassword, isValid } from "../utils/hashPssword.util.js";
import jwt from "jsonwebtoken";

class SessionsController {
  constructor(model) {
    this.controller = model;
  }
  register = async (req, res, next) => {
    try {
      const data = req.body;
      let { password } = req.body;
      const hashedPassword = await hashPassword(password);
      const response = await this.controller.create({
        ...data,
        password: hashedPassword,
      });
      return res.json({
        statusCode: 201,
        response,
        message: "registered!",
      });
    } catch (error) {
      next(error);
    }
  };
  login = async (req, res, next) => {
    try {
      const data = req.body;
      const user = await this.controller.readByEmail(data.email);
      if (!user) {
        return res.json({
          statusCode: 401,
          response: "el usuario no esta registrado!",
        });
      }
      const isOk = isValid(data.password, user.password);
      if (!isOk)
        return res.json({
          statusCode: 401,
          response: "la contraseña o el usuario no coinciden",
        });
      user.password = null;
      user._id = null;
      const token = jwt.sign(
        {
          username: user.username,
          email: user.email,
          photo: user.photo,
          role: user.role,
        },
        process.env.SECRET_KEY,
        { expiresIn: "60m" }
      );
      res.json({
        statusCode: 200,
        response: user,
        message: "Logged In!",
        token,
      });
      req.session = { user }
    } catch (error) {
      next(error);
    }
  };
  signout = (req, res, next) => {
    try {
      return res.json({
        statusCode: 200,
        message: "Signed Out!"
      })
    } catch (error) {
        next(error)
    }
  };
}

const sessionsController = new SessionsController(users);

export const { register, login, signout } = sessionsController;
