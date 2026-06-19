import { In, Repository } from "typeorm";
import { IFindProducts } from "@modules/products/domain/models/IFindProducts";
import { ICreateProduct } from "@modules/products/domain/models/ICreateProduct";
import { IUpdateStockProduct } from "@modules/products/domain/models/IUpdateStockProduct";
import { IProductPaginate } from "@modules/products/domain/models/IProductPaginate";
import { AppDataSource } from "@shared/infra/typeorm/data-source";
import { Product } from "../entities/Product";
import { IProductsRepository } from "@modules/products/domain/repositories/IProductsRepository";
import { IProduct } from "@modules/products/domain/models/IProduct";

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
    const product = this.ormRepository.create({ name, price, quantity });
    await this.ormRepository.save(product);
    return product as unknown as IProduct;
  }

  public async save(product: Product): Promise<IProduct> {
    await this.ormRepository.save(product);
    return product as unknown as IProduct;
  }

  public async remove(product: Product): Promise<void> {
    await this.ormRepository.remove(product);
  }

  public async updateStock(products: IUpdateStockProduct[]): Promise<void> {
    await this.ormRepository.save(products);
  }

  public async findByName(name: string): Promise<IProduct | null> {
    const product = await this.ormRepository.findOneBy({
      name,
    });

    return product as unknown as IProduct | null;
  }

  public async findById(id: string): Promise<IProduct | null> {
    const product = await this.ormRepository.findOneBy({ id });
    return product as unknown as IProduct;
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

    const result = {
      per_page: take,
      total: count,
      current_page: page,
      data: products,
    };

    return result as unknown as IProductPaginate;
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
