import { ICreateUser } from "@modules/customers/domain/models/ICreateUser";
import { ICustomer } from "@modules/customers/domain/models/ICustomer";
import { AppDataSource } from "@shared/infra/typeorm/data-source";
import { Customer } from "../entities/Customer";
import { Repository } from "typeorm";
import {
  ICustomersRepository,
  Pagination,
} from "@modules/customers/domain/repositories/ICustomersRepositories";

export default class CustomersRepository implements ICustomersRepository {
  private ormRepository: Repository<Customer>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(Customer);
  }

  async findByName(name: string): Promise<ICustomer | null> {
    const customer = await this.ormRepository.findOneBy({
      name,
    });

    return customer;
  }

  async findById(id: number): Promise<ICustomer | null> {
    const customer = await this.ormRepository.findOneBy({
      id,
    });

    return customer;
  }

  async findByEmail(email: string): Promise<ICustomer | null> {
    const customer = await this.ormRepository.findOneBy({
      email,
    });

    return customer;
  }

  async create({ name, email }: ICreateUser): Promise<ICustomer> {
    const customer = this.ormRepository.create({ name, email });
    await this.ormRepository.save(customer);
    return customer;
  }

  async save(customer: ICustomer): Promise<ICustomer> {
    await this.ormRepository.save(customer);
    return customer;
  }

  async remove(customer: ICustomer): Promise<void> {
    await this.ormRepository.remove(customer);
    return;
  }

  async findAndCount({
    take,
    skip,
  }: Pagination): Promise<[ICustomer[], number]> {
    const [customers, total] = await this.ormRepository.findAndCount({
      take,
      skip,
    });

    return [customers, total];
  }
}
