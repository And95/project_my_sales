import { SearchParams } from "../infra/database/repositories/UsersRepositories";
import { IUsersRepository } from "../domain/repositories/IUserRepositories";
import { IPaginateUser } from "../domain/models/IPaginateUser";
import { inject, injectable } from "tsyringe";

@injectable()
export default class ListUserService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    page,
    skip,
    take,
  }: SearchParams): Promise<IPaginateUser> {
    const users = await this.usersRepository.findAll({
      page,
      skip,
      take,
    });

    return users;
  }
}
