import { Router } from "express";
import UpdateAvatarControllers from "../controllers/UpdateAvatarControllers";
import multer from "multer";
import uploadConfig from "@config/uploads";
import AuthMiddleware from "@shared/middlewares/AuthMiddleware";

const avatarRouter = Router();
const updateAvatarController = new UpdateAvatarControllers();
const upload = multer(uploadConfig);

avatarRouter.patch(
  "/",
  AuthMiddleware.execute,
  upload.single("avatar"),
  updateAvatarController.update,
);

export default avatarRouter;
