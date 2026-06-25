import { Customer } from "@modules/customers/infra/database/entities/Customer";
import { ICreateUser } from "../../models/ICreateUser";
import { ICustomer } from "../../models/ICustomer";
import { ICustomersRepository, Pagination } from "../ICustomersRepositories";

export default class FakeCustomersRepository implements ICustomersRepository {
  private customers: Customer[] = [];
  public create({ name, email }: ICreateUser): Promise<ICustomer> {
    const customer = new Customer();
    customer.id = this.customers.length + 1;
    customer.name = name;
    customer.email = email;
    this.customers.push(customer);
    return Promise.resolve(customer);
  }

  public save(customer: ICustomer): Promise<ICustomer> {
    const findIndex = this.customers.findIndex(
      (findCustomer) => findCustomer.id === customer.id,
    );
    this.customers[findIndex] = customer;
    return Promise.resolve(customer);
  }

  public remove(customer: Customer): Promise<void> {
    const index = this.customers.findIndex((c) => c.id === customer.id);
    if (index !== -1) {
      this.customers.splice(index, 1);
    }
    return Promise.resolve();
  }

  public findAll(): Promise<Customer[]> {
    return Promise.resolve(this.customers);
  }

  public findByName(name: string): Promise<Customer | null> {
    const customer = this.customers.find((customer) => customer.name === name);
    return Promise.resolve(customer ?? null);
  }

  public findById(id: number): Promise<Customer | null> {
    const customer = this.customers.find((customer) => customer.id === id);
    return Promise.resolve(customer ?? null);
  }

  public findByEmail(email: string): Promise<Customer | null> {
    const customer = this.customers.find(
      (customer) => customer.email === email,
    );
    return Promise.resolve(customer ?? null);
  }

  public findAndCount(pagination: Pagination): Promise<[ICustomer[], number]> {
    const { skip, take } = pagination;
    const customers = this.customers.slice(skip, skip + take);
    return Promise.resolve([customers, this.customers.length]);
  }
}
