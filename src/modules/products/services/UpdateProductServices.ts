import { productsRepository } from "../infra/database/repositories/ProductsRepositories";
import { IUpdateProduct } from "../domain/models/IUpdateProduct";
import { Product } from "../infra/database/entities/Product";
import RedisCache from "@shared/cache/RedisCache";
import AppError from "@shared/errors/AppError";

export default class UpdateProductService {
  public async execute({
    id,
    name,
    price,
    quantity,
  }: IUpdateProduct): Promise<Product> {
    const redisCache = new RedisCache();
    const product = await productsRepository.findById(id);

    if (!product) {
      throw new AppError("Product not found.", 404);
    }

    const productExists = await productsRepository.findByName(name);

    if (productExists && name !== product.name) {
      throw new AppError("There is already one product with this name");
    }

    product.name = name;
    product.price = price;
    product.quantity = quantity;

    await productsRepository.save(product);
    await redisCache.invalidate("api-mysales-PRODUCT_LIST");

    return product;
  }
}
