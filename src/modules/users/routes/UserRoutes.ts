import { Router } from "express";
import UsersControllers from "../controllers/UsersControllers";
import { createUserSchema } from "../schemas/UserSchemas";
import AuthMiddleware from "@shared/middlewares/AuthMiddleware";

const usersRouter = Router();
const usersController = new UsersControllers();

usersRouter.get("/", AuthMiddleware.execute, usersController.index);
usersRouter.post("/", createUserSchema, usersController.create);

export default usersRouter;
