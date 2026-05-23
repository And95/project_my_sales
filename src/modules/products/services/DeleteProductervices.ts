import AppError from "@shared/errors/AppError";
import { productsRepository } from "../database/repositories/ProductsRepositories";

interface IDeleteProduct {
  id: string;
}

export default class DeleteProductService {
  public async execute({ id }: IDeleteProduct): Promise<void> {
    const product = await productsRepository.findById(id);

    if (!product) {
      throw new AppError("Product not found.", 404);
    }

    await productsRepository.remove(product);
  }
}
