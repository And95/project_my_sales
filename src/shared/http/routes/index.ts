import productsRouter from "@modules/products/routes/ProductRoutes";
import passwordRouter from "@modules/users/routes/PasswordRoutes";
import sessionsRouter from "@modules/users/routes/SessionRoutes";
import avatarRouter from "@modules/users/routes/AvatarRoutes";
import usersRouter from "@modules/users/routes/UserRoutes";
import uploadConfig from "@config/uploads";
import express, { Router } from "express";

const routes = Router();

routes.get("/health", (request, response) => {
  return response.json({ message: "Hello Dev! I am Alive" });
});

routes.use("/products", productsRouter);
routes.use("/users", usersRouter);
routes.use("/sessions", sessionsRouter);
routes.use("/avatar", avatarRouter);
routes.use("/files", express.static(uploadConfig.directory));
routes.use("/password", passwordRouter);

export default routes;
