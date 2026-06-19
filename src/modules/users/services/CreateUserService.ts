import { IUsersRepository } from "../domain/repositories/IUserRepositories";
import { User } from "../infra/database/entities/User";
import AppError from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import { hash } from "bcrypt";
import "reflect-metadata";

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
export default class CreateUserService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
  ) {}
  public async execute({ name, email, password }: IRequest): Promise<User> {
    const emailExists = await this.usersRepository.findByEmail(email);
    if (emailExists) {
      throw new AppError("Email address already used.", 409);
    }

    const hashedPassword = await hash(password, 10);
    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }
}
