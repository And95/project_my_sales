import { ICustomersRepository } from "../domain/repositories/ICustomersRepositories";
import AppError from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IDeleteCustomer {
  id: number;
}

@injectable()
export default class DeleteCustomerService {
  constructor(
    @inject("CustomersRepository")
    private readonly customersRepository: ICustomersRepository,
  ) {}
  public async execute({ id }: IDeleteCustomer): Promise<void> {
    const customer = await this.customersRepository.findById(id);

    if (!customer) {
      throw new AppError("Customer not found.", 404);
    }

    await this.customersRepository.remove(customer);
  }
}
