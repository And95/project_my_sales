import { IProductsRepository } from "../domain/repositories/IProductsRepository";
import { Product } from "../infra/database/entities/Product";
import RedisCache from "@shared/cache/RedisCache";
import AppError from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IRequest {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

@injectable()
export default class UpdateProductService {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository,
  ) {}
  public async execute({
    id,
    name,
    price,
    quantity,
  }: IRequest): Promise<Product> {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new AppError("Product not found.", 404);
    }

    const productExists = await this.productsRepository.findByName(name);

    if (productExists && name !== product.name) {
      throw new AppError("There is already one product with this name");
    }

    const redisCache = new RedisCache();
    await redisCache.invalidate("api-vendas-PRODUCT_LIST");

    product.name = name;
    product.price = price;
    product.quantity = quantity;

    await this.productsRepository.save(product as unknown as Product);
    return product as unknown as Product;
  }
}
