import express, { Request, Response } from "express";

import connection from "./app/database/connection";
import { verifyToken } from "./app/middlewares/auth";

import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";

const routes = express.Router();

const userController = new UserController();
const sessionController = new SessionController();

routes.get("/users", verifyToken, userController.listAll);

routes.post("/register", userController.create);

routes.get("/session", sessionController.retrieveToken)

export default routes;
