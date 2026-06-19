import { SearchParams } from "@modules/users/infra/database/repositories/UsersRepositories";
import { IProductsRepository } from "../domain/repositories/IProductsRepository";
import { IProductPaginate } from "../domain/models/IProductPaginate";
import RedisCache from "@shared/cache/RedisCache";
import { inject, injectable } from "tsyringe";

@injectable()
export default class ListProductService {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository,
  ) {}
  public async execute({
    page,
    skip,
    take,
  }: SearchParams): Promise<IProductPaginate> {
    const redisCache = new RedisCache();
    let products = await redisCache.recover<IProductPaginate>(
      "api-vendas-PRODUCT_LIST",
    );

    if (!products) {
      products = await this.productsRepository.findAll({ page, skip, take });

      await redisCache.save(
        "api-vendas-PRODUCT_LIST",
        JSON.stringify(products),
      );
    }

    return products;
  }
}
