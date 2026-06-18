import { productsRepository } from "../infra/database/repositories/ProductsRepositories";
import { IDeleteProduct } from "../domain/models/IDeleteProduct";
import RedisCache from "@shared/cache/RedisCache";
import AppError from "@shared/errors/AppError";

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
