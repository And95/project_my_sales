import { User } from "../infra/database/entities/User";
import { UsersRepository } from "../infra/database/repositories/UsersRepositories";

export default class ListUsersService {
  async execute(): Promise<User[]> {
    const users = await UsersRepository.find();
    return users;
  }
}
