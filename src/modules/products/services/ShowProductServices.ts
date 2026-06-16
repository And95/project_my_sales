import AppError from "@shared/errors/AppError";
import { productsRepository } from "../infra/database/repositories/ProductsRepositories";
import { Product } from "../infra/database/entities/Product";

interface IShowProduct {
  id: string;
}

export default class ShowProductService {
  async execute({ id }: IShowProduct): Promise<Product> {
    const product = await productsRepository.findById(id);

    if (!product) {
      throw new AppError("Product not found.", 404);
    }

    return product;
  }
}
