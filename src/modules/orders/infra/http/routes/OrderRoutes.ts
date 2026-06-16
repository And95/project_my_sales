import { Router } from "express";
import OrderControllers from "../controllers/OrderControllers";
import AuthMiddleware from "@shared/middlewares/AuthMiddleware";
import {
  createOrderValidate,
  idParamsValidate,
} from "../schemas/OrdersSchemas";

const orderRoutes = Router();
const orderControllers = new OrderControllers();

orderRoutes.use(AuthMiddleware.execute);

orderRoutes.get<{ id: string }>(
  "/:id",
  idParamsValidate,
  orderControllers.show,
);
orderRoutes.post("/", createOrderValidate, orderControllers.create);

export default orderRoutes;
