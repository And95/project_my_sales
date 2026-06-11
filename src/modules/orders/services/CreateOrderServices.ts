import { customersRepository } from "@modules/custumers/database/repositories/CustumerRepositories";
import { productsRepository } from "@modules/products/database/repositories/ProductsRepositories";
import { Product } from "@modules/products/database/entities/Product";
import { Order } from "../database/entities/Order";
import AppError from "@shared/errors/AppError";
import { orderRepositories } from "../database/repositories/OrderRepostories";

interface ICreateOrder {
  customer_id: string;
  products: Product[];
}

export class CreateOrderService {
  async execute({ customer_id, products }: ICreateOrder): Promise<Order> {
    const customerExists = await customersRepository.findById(
      Number(customer_id),
    );

    if (!customerExists) {
      throw new AppError("Could not find any customer with the given id.");
    }

    const existsProducts = await productsRepository.findAllByIds(products);

    if (!existsProducts.length) {
      throw new AppError("Could not find any products with the given ids.");
    }

    const existsProductsIds = existsProducts.map((product) => product.id);

    const checkInexistentProducts = products.filter(
      (product) => !existsProductsIds.includes(product.id),
    );

    if (checkInexistentProducts.length) {
      throw new AppError(
        `Could not find product ${checkInexistentProducts[0]?.id}.`,
        404,
      );
    }

    const productUnavailable = products.find((product) => {
      const productExists = existsProducts.find(
        (item) => item.id === product.id,
      );

      return !productExists || product.quantity > productExists.quantity;
    });

    if (productUnavailable) {
      const productExists = existsProducts.find(
        (item) => item.id === productUnavailable.id,
      );

      throw new AppError(
        `The quantity ${productUnavailable.quantity} is not available for product ${productUnavailable.id}. Available: ${productExists?.quantity ?? 0}.`,
        409,
      );
    }

    const serializedProducts = products.map((product) => ({
      product_id: product.id,
      quantity: product.quantity,
      price: existsProducts.find((item) => item.id === product.id)?.price ?? 0,
    }));

    const order = await orderRepositories.createOrder({
      customer: customerExists,
      products: serializedProducts,
    });

    const { order_products } = order;

    const updateProductQuantity = order_products!.map((product) => ({
      id: product.product_id!,
      quantity:
        (existsProducts.find((item) => item.id === product.product_id)
          ?.quantity ?? 0) - (product.quantity ?? 0),
    }));

    await productsRepository.save(updateProductQuantity);

    return order;
  }
}
