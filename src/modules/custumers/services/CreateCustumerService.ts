import AppError from "@shared/errors/AppError";
import { customersRepository } from "../infra/database/repositories/CustumerRepositories";
import { Customer } from "../infra/database/entities/Custumer";
import { ICreateUser } from "../domain/models/ICreateUser";

export default class CreateCustomerService {
  public async execute({ name, email }: ICreateUser): Promise<Customer> {
    const emailExists = await customersRepository.findByEmail(email);

    if (emailExists) {
      throw new AppError("Email address already used.", 409);
    }

    const customer = customersRepository.create({
      name,
      email,
    });

    await customersRepository.save(customer);

    return customer;
  }
}
