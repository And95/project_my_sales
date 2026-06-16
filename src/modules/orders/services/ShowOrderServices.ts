import AppError from "@shared/errors/AppError";
import { Order } from "../infra/database/entities/Order";
import { orderRepositories } from "../infra/database/repositories/OrderRepostories";

export class ShowOrderService {
  async execute(id: string): Promise<Order> {
    const order = await orderRepositories.findById(Number(id));

    if (!order) {
      throw new AppError("Order not found.", 404);
    }

    return order;
  }
}
