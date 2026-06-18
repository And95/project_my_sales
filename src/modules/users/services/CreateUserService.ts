import { UsersRepository } from "../infra/database/repositories/UsersRepositories";
import { ICreateUser } from "../domain/models/ICreateUser";
import { User } from "../infra/database/entities/User";
import AppError from "@shared/errors/AppError";
import { hash } from "bcrypt";

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

    await UsersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
