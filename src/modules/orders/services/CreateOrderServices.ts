import AppError from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import { IOrdersRepository } from "../domain/repositories/IOrdersRepository";
import { ICustomersRepository } from "@modules/customers/domain/repositories/ICustomersRepositories";
import { IProductsRepository } from "@modules/products/domain/repositories/IProductsRepository";
import { IOrder } from "../domain/models/IOrder";

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}
@injectable()
class CreateOrderService {
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
      const [inexistentProduct] = checkInexistentProducts;

      throw new AppError(
        `Could not find product ${inexistentProduct?.id}.`,
        404,
      );
    }

    const insufficientQuantityProducts = products.filter((product) => {
      const productFound = existsProducts.find((p) => p.id === product.id);

      return !!productFound && productFound.quantity < product.quantity;
    });

    if (insufficientQuantityProducts.length) {
      const productsMessage = insufficientQuantityProducts
        .map((product) => {
          const productFound = existsProducts.find((p) => p.id === product.id);

          return `${productFound?.name} (requested: ${product.quantity}, available: ${productFound?.quantity ?? 0})`;
        })
        .join(", ");

      throw new AppError(
        `Insufficient quantity for product(s): ${productsMessage}.`,
        409,
      );
    }

    const serializedProducts = products.map((product) => {
      const productFound = existsProducts.find((p) => p.id === product.id);

      if (!productFound) {
        throw new AppError(`Could not find product ${product.id}.`, 404);
      }

      return {
        product_id: product.id,
        quantity: product.quantity,
        price: productFound.price,
      };
    });

    const order = await this.ordersRepository.create({
      customer: customerExists,
      products: serializedProducts,
    });

    const { order_products } = order;

    const updatedProductQuantity = order_products.map((product) => {
      const productExists = existsProducts.find(
        (p) => p.id === product.product_id,
      );

      if (!productExists) {
        throw new AppError(
          `Could not find product ${product.product_id}.`,
          404,
        );
      }

      return {
        id: product.product_id,
        quantity: productExists.quantity - product.quantity,
      };
    });

    await this.productsRepository.updateStock(updatedProductQuantity);

    return order;
  }
}

export default CreateOrderService;
