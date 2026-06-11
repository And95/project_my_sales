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

    if (!products.length) {
      throw new AppError("You must provide at least one product.", 400);
    }

    // Valida quantidades inválidas
    const invalidQuantity = products.find((product) => product.quantity <= 0);

    if (invalidQuantity) {
      throw new AppError(
        `Invalid quantity for product ${invalidQuantity.id}.`,
        400,
      );
    }

    // Agrupa produtos repetidos
    const groupedProducts = products.reduce((acc, product) => {
      const existing = acc.get(product.id);

      if (existing) {
        existing.quantity += product.quantity;
      } else {
        acc.set(product.id, { ...product });
      }

      return acc;
    }, new Map<string, Product>());

    const normalizedProducts = Array.from(groupedProducts.values());

    const existsProducts =
      await productsRepository.findAllByIds(normalizedProducts);

    if (!existsProducts.length) {
      throw new AppError("Could not find any products with the given ids.");
    }

    const productsMap = new Map(
      existsProducts.map((product) => [product.id, product]),
    );

    const inexistentProduct = normalizedProducts.find(
      (product) => !productsMap.has(product.id),
    );

    if (inexistentProduct) {
      throw new AppError(
        `Could not find product ${inexistentProduct.id}.`,
        404,
      );
    }

    const productUnavailable = normalizedProducts.find((product) => {
      const productExists = productsMap.get(product.id);

      return !productExists || product.quantity > productExists.quantity;
    });

    if (productUnavailable) {
      const productExists = productsMap.get(productUnavailable.id);

      throw new AppError(
        `The quantity ${productUnavailable.quantity} is not available for product ${productUnavailable.id}. Available: ${productExists?.quantity ?? 0}.`,
        409,
      );
    }

    const serializedProducts = normalizedProducts.map((product) => ({
      product_id: product.id,
      quantity: product.quantity,
      price: productsMap.get(product.id)?.price ?? 0,
    }));

    const order = await orderRepositories.createOrder({
      customer: customerExists,
      products: serializedProducts,
    });

    const updateProductQuantity = order.order_products.map((product) => {
      const existingProduct = productsMap.get(product.product_id);

      return {
        id: product.product_id,
        quantity: (existingProduct?.quantity ?? 0) - product.quantity,
      };
    });

    await productsRepository.save(updateProductQuantity);

    return order;
  }
}
