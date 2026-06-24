import AuthMiddleware from "@shared/middlewares/AuthMiddleware";
import UsersControllers from "../controllers/UsersControllers";
import { createUserSchema } from "../schemas/UserSchemas";
import { Router } from "express";

const usersRouter = Router();
const usersController = new UsersControllers();

usersRouter.get("/", AuthMiddleware.execute, usersController.index);
usersRouter.post("/", createUserSchema, usersController.create);

export default usersRouter;
