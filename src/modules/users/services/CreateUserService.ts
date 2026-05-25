import { hash } from "bcrypt";
import AppError from "@shared/errors/AppError";
import { User } from "../database/entities/User";
import { UsersRepository } from "../database/repositories/UsersRepositories";

interface ICreateUser {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: ICreateUser): Promise<User> {
    const emailExists = await UsersRepository.findByEmail(email);

    if (emailExists) {
      throw new AppError("Email address already used.", 409);
    }

    const hashedPassword = await hash(password, 8);

    const user = UsersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }
}

export default CreateUserService;
