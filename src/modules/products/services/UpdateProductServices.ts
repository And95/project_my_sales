import AppError from "@shared/errors/AppError";
import { Product } from "../database/entities/Product";
import { productsRepository } from "../database/repositories/ProductsRepositories";

interface IUpdateProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default class UpdateProductService {
  public async execute({
    id,
    name,
    price,
    quantity,
  }: IUpdateProduct): Promise<Product> {
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

    return product;
  }
}
