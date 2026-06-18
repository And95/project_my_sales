import { ICreateOrder } from "@modules/orders/domain/models/ICreateOrder";
import { AppDataSource } from "@shared/infra/typeorm/data-source";
import { Order } from "../entities/Order";

export const orderRepositories = AppDataSource.getRepository(Order).extend({
  async findById(id: number): Promise<Order | null> {
    const order = await this.findOne({
      where: { id },
      relations: ["order_products", "customer"],
    });

    return order;
  },

  async createOrder({ customer, products }: ICreateOrder): Promise<Order> {
    const order = this.create({
      customer,
      order_products: products,
    });

    await this.save(order);

    return order;
  },
});
