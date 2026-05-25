import productsRouter from "@modules/products/routes/ProductRoutes";
import usersRouter from "@modules/users/routes/UserRoutes";
import { Router } from "express";

const routes = Router();

routes.get("/health", (request, response) => {
  return response.json({ message: "Hello Dev! I am Alive" });
});

routes.use("/products", productsRouter);
routes.use("/users", usersRouter);

export default routes;
