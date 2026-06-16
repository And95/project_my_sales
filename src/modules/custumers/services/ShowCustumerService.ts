import AppError from "@shared/errors/AppError";
import { customersRepository } from "../infra/database/repositories/CustumerRepositories";
import { Customer } from "../infra/database/entities/Custumer";

interface IShowCustomer {
  id: number;
}

export default class ShowCustomerService {
  public async execute({ id }: IShowCustomer): Promise<Customer> {
    const customer = await customersRepository.findById(Number(id));

    if (!customer) {
      throw new AppError("Customer not found.", 404);
    }

    return customer;
  }
}
