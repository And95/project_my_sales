import { ICreateUser } from "../models/ICreateUser";
import { ICustomer } from "../models/ICustomer";

export interface Pagination {
  take: number;
  skip: number;
}

export interface ICustomersRepository {
  findByEmail(email: string): Promise<ICustomer | null>;
  create(data: ICreateUser): Promise<ICustomer>;
  save(customer: ICustomer): Promise<ICustomer>;
  remove(customer: ICustomer): Promise<void>;
  findById(id: number): Promise<ICustomer | null>;
  findAndCount(pagination: Pagination): Promise<[ICustomer[], number]>;
  findByName(name: string): Promise<ICustomer | null>;
}
