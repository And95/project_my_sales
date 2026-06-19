import { IOrdersRepository } from "../domain/repositories/IOrdersRepository";
import { IOrder } from "../domain/models/IOrder";
import AppError from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IRequest {
  id: string;
}

@injectable()
export default class ShowOrderService {
  constructor(
    @inject("OrdersRepository")
    private ordersRepository: IOrdersRepository,
  ) {}
  public async execute({ id }: IRequest): Promise<IOrder> {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      throw new AppError("Order not found.");
    }

    return order;
  }
}
