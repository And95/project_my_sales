import { IProductsRepository } from "@modules/products/domain/repositories/IProductsRepository";
import { IUpdateStockProduct } from "@modules/products/domain/models/IUpdateStockProduct";
import { IProductPaginate } from "@modules/products/domain/models/IProductPaginate";
import { ICreateProduct } from "@modules/products/domain/models/ICreateProduct";
import { IFindProducts } from "@modules/products/domain/models/IFindProducts";
import { IProduct } from "@modules/products/domain/models/IProduct";
import { AppDataSource } from "@shared/infra/typeorm/data-source";
import { Product } from "../entities/Product";
import { In, Repository } from "typeorm";

type SearchParams = {
  page: number;
  skip: number;
  take: number;
};

export class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProduct): Promise<IProduct> {
    const product = this.ormRepository.create({
      name,
      price,
      quantity,
    });

    await this.ormRepository.save(product);

    return product as unknown as IProduct;
  }

  public async save(product: Product): Promise<IProduct> {
    await this.ormRepository.save(product);

    return product as unknown as IProduct;
  }

  public async updateStock(products: IUpdateStockProduct[]): Promise<void> {
    for (const product of products) {
      await this.ormRepository.update(product.id, {
        quantity: product.quantity,
      });
    }
  }

  public async remove(product: Product): Promise<void> {
    await this.ormRepository.remove(product);
  }

  public async findByName(name: string): Promise<IProduct | null> {
    const product = await this.ormRepository.findOneBy({
      name,
    });

    return product as IProduct | null;
  }

  public async findById(id: string): Promise<IProduct | null> {
    const product = await this.ormRepository.findOneBy({
      id,
    });

    return product as IProduct | null;
  }

  public async findAll({
    page,
    skip,
    take,
  }: SearchParams): Promise<IProductPaginate> {
    const [products, count] = await this.ormRepository
      .createQueryBuilder()
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return {
      per_page: take,
      total: count,
      current_page: page,
      data: products as unknown as IProduct[],
    };
  }

  public async findAllByIds(products: IFindProducts[]): Promise<IProduct[]> {
    const productIds = products.map((product) => product.id);

    const existentProducts = await this.ormRepository.find({
      where: {
        id: In(productIds),
      },
    });

    return existentProducts as unknown as IProduct[];
  }
}
