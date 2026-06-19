import AppError from "@shared/errors/AppError";
import { Customer } from "../infra/database/entities/Customer";
import { ICreateUser } from "../domain/models/ICreateUser";
import { ICustomersRepository } from "../domain/repositories/ICustomersRepositories";
import { inject, injectable } from "tsyringe";

@injectable()
export default class CreateCustomerService {
  constructor(
    @inject("CustomersRepository")
    private customerRepository: ICustomersRepository,
  ) {}

  public async execute({ name, email }: ICreateUser): Promise<Customer> {
    const emailExists = await this.customerRepository.findByEmail(email);

    if (emailExists) {
      throw new AppError("Email address already used.", 409);
    }

    const customer = await this.customerRepository.create({
      name,
      email,
    });

    return customer;
  }
}
