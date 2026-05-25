import { Router } from "express";
import ProductsController from "../controllers/ProductsControllers";
import {
  createProductSchema,
  idParamsValidation,
  updateProductSchema,
} from "../schemas/ProductSchemas";

const productsRouter = Router();
const productsController = new ProductsController();

productsRouter.get("/", productsController.index.bind(productsController));
productsRouter.get(
  "/:id",
  idParamsValidation,
  productsController.show.bind(productsController),
);
productsRouter.post(
  "/",
  createProductSchema,
  productsController.create.bind(productsController),
);
productsRouter.put(
  "/:id",
  updateProductSchema,
  productsController.update.bind(productsController),
);
productsRouter.delete(
  "/:id",
  idParamsValidation,
  productsController.delete.bind(productsController),
);

export default productsRouter;
