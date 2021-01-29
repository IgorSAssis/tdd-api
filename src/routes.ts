import express from "express";

import { authorizationMiddleware } from "./app/middlewares/auth";

import userController from "./app/controllers/UserController";
import sessionController from "./app/controllers/SessionController";

const routes = express.Router();

routes.get("/users/:id", authorizationMiddleware, userController().show);
routes.get("/users", authorizationMiddleware, userController().listAll);

routes.post("/register", userController().create);

routes.get("/session", sessionController().retrieveToken);

export default routes;
