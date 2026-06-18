import { productsRepository } from "../infra/database/repositories/ProductsRepositories";
import { IShowProduct } from "../domain/models/IShowProduct";
import { Product } from "../infra/database/entities/Product";
import AppError from "@shared/errors/AppError";

export default class ShowProductService {
  async execute({ id }: IShowProduct): Promise<Product> {
    const product = await productsRepository.findById(id);

    if (!product) {
      throw new AppError("Product not found.", 404);
    }

    return product;
  }
}
