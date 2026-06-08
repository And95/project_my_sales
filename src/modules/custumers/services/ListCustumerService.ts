import { customersRepository } from "../database/repositories/CustumerRepositories";
import { Customer } from "../database/entities/Custumer";

export default class ListCustomerService {
  async execute(): Promise<Customer[]> {
    const customers = await customersRepository.find();

    return customers;
  }
}
