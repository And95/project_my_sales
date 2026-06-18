import AppError from "@shared/errors/AppError";
import { User } from "../infra/database/entities/User";
import { UsersRepository } from "../infra/database/repositories/UsersRepositories";
import { IShowUser } from "../domain/models/IShowUser";

export default class ShowProfileService {
  async execute({ id }: IShowUser): Promise<User> {
    const user = await UsersRepository.findById(id);

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    return user;
  }
}
