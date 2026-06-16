import { customersRepository } from "@modules/custumers/infra/database/repositories/CustumerRepositories";
import { productsRepository } from "@modules/products/infra/database/repositories/ProductsRepositories";
import { Order } from "../infra/database/entities/Order";
import AppError from "@shared/errors/AppError";
import { orderRepositories } from "../infra/database/repositories/OrderRepostories";

interface ICreateOrder {
  customer_id: string;

  products: {
    product_id: string;
    quantity: number;
  }[];
}

export class CreateOrderService {
  async execute({ customer_id, products }: ICreateOrder): Promise<Order> {
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

    // Agrupa repetidos
    const groupedProducts = products.reduce(
      (acc, product) => {
        const existing = acc.get(product.product_id);

        if (existing) {
          existing.quantity += product.quantity;
        } else {
          acc.set(product.product_id, {
            product_id: product.product_id,
            quantity: product.quantity,
          });
        }

        return acc;
      },
      new Map<
        string,
        {
          product_id: string;
          quantity: number;
        }
      >(),
    );

    const normalizedProducts = Array.from(groupedProducts.values());

    const checkProducts = normalizedProducts.map((product) => ({
      id: product.product_id,
    }));

    const existsProducts = await productsRepository.findAllByIds(checkProducts);

    if (!existsProducts.length) {
      throw new AppError("Could not find any products with the given ids.");
    }

    const productsMap = new Map(
      existsProducts.map((product) => [product.id, product]),
    );

    const inexistentProduct = normalizedProducts.find(
      (product) => !productsMap.has(product.product_id),
    );

    if (inexistentProduct) {
      throw new AppError(
        `Could not find product ${inexistentProduct.product_id}.`,
        404,
      );
    }

    const productUnavailable = normalizedProducts.find((product) => {
      const existing = productsMap.get(product.product_id);

      return !existing || product.quantity > existing.quantity;
    });

    if (productUnavailable) {
      const existing = productsMap.get(productUnavailable.product_id);

      throw new AppError(
        `The quantity ${productUnavailable.quantity} is not available for product ${productUnavailable.product_id}. Available: ${existing?.quantity ?? 0}.`,
        409,
      );
    }

    const serializedProducts = normalizedProducts.map((product) => ({
      product_id: product.product_id,
      quantity: product.quantity,
      price: productsMap.get(product.product_id)?.price ?? 0,
    }));

    const order = await orderRepositories.createOrder({
      customer: customerExists,
      products: serializedProducts,
    });

    const updateProductQuantity = order.order_products.map((product) => {
      const existing = productsMap.get(product.product_id);

      return {
        id: product.product_id,
        quantity: (existing?.quantity ?? 0) - product.quantity,
      };
    });

    await productsRepository.save(updateProductQuantity);

    return order;
  }
}
