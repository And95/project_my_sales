import { Router } from "express";
import ProductsController from "../controllers/ProductsControllers";

const productsRouter = Router();
const productsController = new ProductsController();

productsRouter.get("/", productsController.index.bind(productsController));
productsRouter.get("/:id", productsController.show.bind(productsController));
productsRouter.post("/", productsController.create.bind(productsController));
productsRouter.put("/:id", productsController.update.bind(productsController));
productsRouter.delete(
  "/:id",
  productsController.delete.bind(productsController),
);

export default productsRouter;
