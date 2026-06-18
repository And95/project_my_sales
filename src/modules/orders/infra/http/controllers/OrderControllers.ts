import { ICreateOrderDTO } from "@modules/orders/domain/models/ICreateOrderDTO";
import { CreateOrderService } from "../../../services/CreateOrderServices";
import { ShowOrderService } from "../../../services/ShowOrderServices";
import { IShowOrder } from "@modules/orders/domain/models/IShowOrder";
import { Request, Response } from "express";

export default class OrderControllers {
  show = async (
    request: Request<IShowOrder>,
    response: Response,
  ): Promise<Response> => {
    const { id } = request.params;
    const showOrder = new ShowOrderService();
    const order = await showOrder.execute(id);

    return response.json(order);
  };

  create = async (
    request: Request<object, object, ICreateOrderDTO>,
    response: Response,
  ): Promise<Response> => {
    const { customer_id, products } = request.body;
    const createOrder = new CreateOrderService();
    const order = await createOrder.execute({
      customer_id,
      products,
    });

    return response.status(201).json(order);
  };
}
