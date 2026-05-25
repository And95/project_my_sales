import { Router } from "express";
import UsersControllers from "../controllers/UsersControllers";
import { createUserSchema } from "../schemas/UserSchemas";

const usersRouter = Router();
const usersController = new UsersControllers();

usersRouter.get("/", usersController.index);
usersRouter.post("/", createUserSchema, usersController.create);

export default usersRouter;
