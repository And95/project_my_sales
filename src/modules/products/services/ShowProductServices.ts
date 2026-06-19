import { IProductsRepository } from "../domain/repositories/IProductsRepository";
import { Product } from "../infra/database/entities/Product";
import AppError from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IRequest {
  id: string;
}

@injectable()
export default class ShowProductService {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository,
  ) {}
  public async execute({ id }: IRequest): Promise<Product> {
    const product = await this.productsRepository.findById(id);
    if (!product) {
      throw new AppError("Product not found.", 404);
    }

    return product as unknown as Product;
  }
}
