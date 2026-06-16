import AppError from "@shared/errors/AppError";
import { productsRepository } from "../infra/database/repositories/ProductsRepositories";
import RedisCache from "@shared/cache/RedisCache";

interface IDeleteProduct {
  id: string;
}

export default class DeleteProductService {
  public async execute({ id }: IDeleteProduct): Promise<void> {
    const redisCache = new RedisCache();
    const product = await productsRepository.findById(id);

    if (!product) {
      throw new AppError("Product not found.", 404);
    }

    await redisCache.invalidate("api-mysales-PRODUCT_LIST");
    await productsRepository.remove(product);
  }
}
