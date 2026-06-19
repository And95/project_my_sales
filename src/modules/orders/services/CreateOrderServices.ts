import { ICustomersRepository } from "@modules/customers/domain/repositories/ICustomersRepositories";
import { IProductsRepository } from "@modules/products/domain/repositories/IProductsRepository";
import { IOrdersRepository } from "../domain/repositories/IOrdersRepository";
import { IOrder } from "../domain/models/IOrder";
import AppError from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
export default class CreateOrderService {
  constructor(
    @inject("OrdersRepository")
    private ordersRepository: IOrdersRepository,
    @inject("CustomersRepository")
    private customersRepository: ICustomersRepository,
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository,
  ) {}
  public async execute({ customer_id, products }: IRequest): Promise<IOrder> {
    const customerExists = await this.customersRepository.findById(
      Number(customer_id),
    );

    if (!customerExists) {
      throw new AppError("Could not find any customer with the given id.", 404);
    }

    const existsProducts = await this.productsRepository.findAllByIds(products);

    if (!existsProducts.length) {
      throw new AppError(
        "Could not find any products with the given ids.",
        404,
      );
    }

    const existsProductsIds = existsProducts.map((product) => product.id);

    const checkInexistentProducts = products.filter(
      (product) => !existsProductsIds.includes(product.id),
    );

    if (checkInexistentProducts.length) {
      const productId = checkInexistentProducts[0]?.id ?? "unknown";
      throw new AppError(`Could not find product ${productId}.`, 404);
    }

    const quantityAvailable = products.filter((product) => {
      const existingProduct = existsProducts.find((p) => p.id === product.id);

      return (existingProduct?.quantity ?? 0) < product.quantity;
    });

    if (!quantityAvailable.length) {
      throw new AppError(`The quantity is not available for.`, 409);
    }

    const serializedProducts = products.map((product) => {
      const existingProduct = existsProducts.find((p) => p.id === product.id);

      return {
        product_id: product.id,
        quantity: product.quantity,
        price: existingProduct?.price ?? 0,
      };
    });

    const order = await this.ordersRepository.create({
      customer: customerExists,
      products: serializedProducts,
    });

    const { order_products } = order;

    const updatedProductQuantity = order_products.map((product) => {
      const existingProduct = existsProducts.find(
        (p) => p.id === product.product_id,
      );

      return {
        id: product.product_id,
        quantity: (existingProduct?.quantity ?? 0) - product.quantity,
      };
    });

    await this.productsRepository.updateStock(updatedProductQuantity);

    return order;
  }
}
