import AppError from "@shared/errors/AppError";
import { customersRepository } from "../database/repositories/CustumerRepositories";

interface IDeleteCustomer {
  id: number;
}

export default class DeleteCustomerService {
  public async execute({ id }: IDeleteCustomer): Promise<void> {
    const customer = await customersRepository.findById(id);

    if (!customer) {
      throw new AppError("Customer not found.", 404);
    }

    await customersRepository.remove(customer);
  }
}
