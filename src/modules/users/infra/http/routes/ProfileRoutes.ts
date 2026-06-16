import { Router } from "express";
import ProfileController from "../controllers/ProfileControllers";
import { UpdateUserSchema } from "../schemas/UpdateSchemas";
import AuthMiddleware from "@shared/middlewares/AuthMiddleware";

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(AuthMiddleware.execute);
profileRouter.get("/", profileController.show);
profileRouter.patch("/", UpdateUserSchema, profileController.update);

export default profileRouter;
