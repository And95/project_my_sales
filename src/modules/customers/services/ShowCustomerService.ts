import { ICustomersRepository } from "../domain/repositories/ICustomersRepositories";
import { Customer } from "../infra/database/entities/Customer";
import { IShowCustomer } from "../domain/models/IShowCustomer";
import AppError from "@shared/errors/AppError";

export default class ShowCustomerService {
  constructor(private readonly customersRepository: ICustomersRepository) {}
  public async execute({ id }: IShowCustomer): Promise<Customer> {
    const customer = await this.customersRepository.findById(Number(id));

    if (!customer) {
      throw new AppError("Customer not found.", 404);
    }

    return customer;
  }
}
