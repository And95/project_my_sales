import { productsRepository } from "../infra/database/repositories/ProductsRepositories";
import { ICreateProduct } from "../domain/models/ICreateProduct";
import { Product } from "../infra/database/entities/Product";
import RedisCache from "@shared/cache/RedisCache";
import AppError from "@shared/errors/AppError";

export class CreateProductService {
  async execute({ name, price, quantity }: ICreateProduct): Promise<Product> {
    const redisCache = new RedisCache();
    const productExists = await productsRepository.findByName(name);

    if (productExists) {
      throw new AppError("There is already one product with this name", 409);
    }

    const product = productsRepository.create({
      name,
      price,
      quantity,
    });

    await productsRepository.save(product);
    await redisCache.invalidate("api-mysales-PRODUCT_LIST");

    return product;
  }
}
