import CustomersRepository from "@modules/customers/infra/database/repositories/CustomerRepositories";
import { productsRepository } from "@modules/products/infra/database/repositories/ProductsRepositories";
import { orderRepositories } from "../infra/database/repositories/OrderRepostories";
import { ICreateOrderDTO } from "@modules/orders/domain/models/ICreateOrderDTO";
import { Order } from "../infra/database/entities/Order";
import AppError from "@shared/errors/AppError";

const customersRepository = new CustomersRepository();

export class CreateOrderService {
  async execute({ customer_id, products }: ICreateOrderDTO): Promise<Order> {
    const customerExists = await customersRepository.findById(
      Number(customer_id),
    );

    if (!customerExists) {
      throw new AppError("Could not find any customer with the given id.");
    }

    if (!products.length) {
      throw new AppError("You must provide at least one product.", 400);
    }

    const invalidQuantity = products.find((product) => product.quantity <= 0);

    if (invalidQuantity) {
      throw new AppError(
        `Invalid quantity for product ${invalidQuantity.product_id}.`,
        400,
      );
    }

    const checkProducts = products.map((product) => ({
      id: product.product_id,
    }));

    const existsProducts = await productsRepository.findAllByIds(checkProducts);

    if (!existsProducts.length) {
      throw new AppError("Could not find any products with the given ids.");
    }

    const productsMap = new Map(
      existsProducts.map((product) => [product.id, product]),
    );

    const serializedProducts = products.map((product) => ({
      product_id: product.product_id,
      quantity: product.quantity,
      price: productsMap.get(product.product_id)?.price ?? 0,
    }));

    const order = await orderRepositories.createOrder({
      customer: customerExists,
      products: serializedProducts,
    });

    return order;
  }
}
