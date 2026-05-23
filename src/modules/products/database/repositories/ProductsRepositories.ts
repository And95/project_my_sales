import { AppDataSource } from "@shared/typeorm/data-source";
import { Product } from "../entities/Product";

export const productsRepository = AppDataSource.getRepository(Product).extend({
  async findByName(name: string): Promise<Product | null> {
    return this.findOneBy({ name });
  },
  async findById(id: string): Promise<Product | null> {
    return this.findOneBy({ id });
  },
});
