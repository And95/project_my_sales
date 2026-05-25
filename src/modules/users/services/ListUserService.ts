import { User } from "../database/entities/User";
import { UsersRepository } from "../database/repositories/UsersRepositories";

export default class ListUsersService {
  async execute(): Promise<User[]> {
    const users = await UsersRepository.find();
    return users;
  }
}
