import productsRouter from "@modules/products/routes/ProductRoutes";
import sessionsRouter from "@modules/users/routes/SessionRoutes";
import usersRouter from "@modules/users/routes/UserRoutes";
import avatarRouter from "@modules/users/routes/AvatarRoutes";
import { Router } from "express";

const routes = Router();

routes.get("/health", (request, response) => {
  return response.json({ message: "Hello Dev! I am Alive" });
});

routes.use("/products", productsRouter);
routes.use("/users", usersRouter);
routes.use("/sessions", sessionsRouter);
routes.use("/avatar", avatarRouter);

export default routes;
