import { Product } from "../database/entities/Product";
import { productsRepository } from "../database/repositories/ProductsRepositories";
import AppError from "@shared/errors/AppError";

interface ICreateProduct {
  name: string;
  price: number;
  quantity: number;
}

export class CreateProductService {
  async execute({ name, price, quantity }: ICreateProduct): Promise<Product> {
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

    return product;
  }
}
