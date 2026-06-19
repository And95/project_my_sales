import { IProductsRepository } from "../domain/repositories/IProductsRepository";
import { IProduct } from "../domain/models/IProduct";
import RedisCache from "@shared/cache/RedisCache";
import AppError from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IRequest {
  name: string;
  price: number;
  quantity: number;
}

@injectable()
export default class CreateProductService {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository,
  ) {}
  async execute({ name, price, quantity }: IRequest): Promise<IProduct> {
    const productExists = await this.productsRepository.findByName(name);

    if (productExists) {
      throw new AppError("There is already one product with this name", 400);
    }

    const redisCache = new RedisCache();
    const product = await this.productsRepository.create({
      name,
      price,
      quantity,
    });

    await redisCache.invalidate("api-vendas-PRODUCT_LIST");
    return product;
  }
}
