import { ICreateOrderDTO } from "@modules/orders/domain/models/ICreateOrderDTO";
import ListOrderService from "@modules/orders/services/ListOrderService";
import CreateOrderService from "../../../services/CreateOrderServices";
import { IShowOrder } from "@modules/orders/domain/models/IShowOrder";
import ShowOrderService from "../../../services/ShowOrderServices";
import { IOrder } from "@modules/orders/domain/models/IOrder";
import { Request, Response } from "express";
import { container } from "tsyringe";

export default class OrderControllers {
  index = async (
    request: Request<IOrder>,
    response: Response,
  ): Promise<Response> => {
    const page = request.query.page ? Number(request.query.page) : 1;
    const limit = request.query.limit ? Number(request.query.limit) : 15;
    const listOrders = container.resolve(ListOrderService);
    const orders = await listOrders.execute({ page, limit });
    return response.json(orders);
  };

  show = async (
    request: Request<IShowOrder>,
    response: Response,
  ): Promise<Response> => {
    const { id } = request.params;
    const showOrder = container.resolve(ShowOrderService);
    const order = await showOrder.execute({ id });
    return response.json(order);
  };

  create = async (
    request: Request<object, object, ICreateOrderDTO>,
    response: Response,
  ): Promise<Response> => {
    const { customer_id, products } = request.body;
    const createOrder = container.resolve(CreateOrderService);
    const order = await createOrder.execute({
      customer_id,
      products: products.map((product) => ({
        id: product.product_id,
        quantity: product.quantity,
      })),
    });

    return response.json(order);
  };
}
