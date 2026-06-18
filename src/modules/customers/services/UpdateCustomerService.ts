import { ICustomersRepository } from "../domain/repositories/ICustomersRepositories";
import { IUpdateCustomer } from "../domain/models/IUpdateCustomer";
import { Customer } from "../infra/database/entities/Customer";
import AppError from "@shared/errors/AppError";

export default class UpdateCustomerService {
  constructor(private readonly customersRepository: ICustomersRepository) {}

  public async execute({
    id,
    name,
    email,
  }: IUpdateCustomer): Promise<Customer> {
    const customer = await this.customersRepository.findById(id);

    if (!customer) {
      throw new AppError("Customer not found.");
    }

    const customerExists = await this.customersRepository.findByEmail(email);

    if (customerExists && email !== customer.email) {
      throw new AppError("There is already one customer with this email.");
    }

    customer.name = name;
    customer.email = email;

    await this.customersRepository.save(customer);

    return customer;
  }
}
