import { IProductsRepository } from "../domain/repositories/IProductsRepository";
import { Product } from "../infra/database/entities/Product";
import RedisCache from "@shared/cache/RedisCache";
import AppError from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IRequest {
  id: string;
}

@injectable()
export default class DeleteProductService {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository,
  ) {}
  public async execute({ id }: IRequest): Promise<void> {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new AppError("Product not found.");
    }

    const redisCache = new RedisCache();
    await redisCache.invalidate("api-vendas-PRODUCT_LIST");
    await this.productsRepository.remove(product as unknown as Product);
  }
}
