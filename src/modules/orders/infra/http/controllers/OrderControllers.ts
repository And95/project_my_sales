import { Request, Response } from "express";
import { ShowOrderService } from "../../../services/ShowOrderServices";
import { CreateOrderService } from "../../../services/CreateOrderServices";

interface IShowParams {
  id: string;
}

interface ICreateOrderBody {
  customer_id: string;

  products: {
    product_id: string;
    quantity: number;
  }[];
}

export default class OrderControllers {
  show = async (
    request: Request<IShowParams>,
    response: Response,
  ): Promise<Response> => {
    const { id } = request.params;

    const showOrder = new ShowOrderService();

    const order = await showOrder.execute(id);

    return response.json(order);
  };

  create = async (
    request: Request<object, object, ICreateOrderBody>,
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
