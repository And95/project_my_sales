import { Product } from "../database/entities/Product";
import { productsRepository } from "../database/repositories/ProductsRepositories";

export default class ListProductService {
  async execute(): Promise<Product[]> {
    const products = await productsRepository.find();

    return products;
  }
}
