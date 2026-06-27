import { IOrdersRepository } from "@modules/orders/domain/repositories/IOrdersRepository";
import { IOrderPaginate } from "@modules/orders/domain/models/IOrderPaginate";
import { ICreateOrder } from "@modules/orders/domain/models/ICreateOrder";
import { AppDataSource } from "@shared/infra/typeorm/data-source";
import { IOrder } from "@modules/orders/domain/models/IOrder";
import { Order } from "../entities/Order";
import { Repository } from "typeorm";

type SearchParams = {
  page: number;
  skip: number;
  take: number;
};

export class OrdersRepository implements IOrdersRepository {
  private ormRepository: Repository<Order>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(Order);
  }

  public async findById(id: string): Promise<IOrder | null> {
    const order = await this.ormRepository.findOne({
      where: { id: Number(id) },
      relations: {
        order_products: true,
        customer: true,
      },
    });

    return order as unknown as IOrder | null;
  }

  public async findAll({
    page,
    skip,
    take,
  }: SearchParams): Promise<IOrderPaginate> {
    const [orders, count] = await this.ormRepository
      .createQueryBuilder()
      .skip(skip)
      .take(take)
      .getManyAndCount();

    const result = {
      per_page: take,
      total: count,
      current_page: page,
      data: orders,
    };

    return result as unknown as IOrderPaginate;
  }

  public async create({ customer, products }: ICreateOrder): Promise<IOrder> {
    const order = this.ormRepository.create({
      customer,
      order_products: products,
    });

    await this.ormRepository.save(order);

    return order as unknown as IOrder;
  }
}
