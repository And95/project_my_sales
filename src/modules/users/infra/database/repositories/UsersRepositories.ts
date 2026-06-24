import { ICreateUser } from "@modules/users/domain/models/ICreateUser";
import { IPaginateUser } from "@modules/users/domain/models/IPaginateUser";
import { Repository } from "typeorm";
import { IUsersRepository } from "@modules/users/domain/repositories/IUserRepositories";
import { AppDataSource } from "@shared/infra/typeorm/data-source";
import { User } from "../entities/User";
import { IUser } from "@modules/users/domain/models/IUser";

export type SearchParams = {
  page: number;
  skip: number;
  take: number;
};

export class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(User);
  }

  public async create({ name, email, password }: ICreateUser): Promise<IUser> {
    const user = this.ormRepository.create({ name, email, password });
    await this.ormRepository.save(user);
    return user as IUser;
  }

  public async save(user: IUser): Promise<void> {
    await this.ormRepository.save(user as User);
  }

  public async findAll({
    page,
    skip,
    take,
  }: SearchParams): Promise<IPaginateUser> {
    const [users, count] = await this.ormRepository
      .createQueryBuilder()
      .skip(skip)
      .take(take)
      .getManyAndCount();

    const result = {
      per_page: take,
      total: count,
      current_page: page,
      data: users,
    };

    return result as IPaginateUser;
  }

  public async findByName(name: string): Promise<IUser | null> {
    const user = await this.ormRepository.findOneBy({
      name,
    });

    return user as IUser;
  }

  public async findById(id: string): Promise<IUser | null> {
    const user = await this.ormRepository.findOneBy({
      id: Number(id),
    });

    return user as IUser;
  }

  public async findByEmail(email: string): Promise<IUser | null> {
    const user = await this.ormRepository.findOneBy({
      email,
    });

    return user as IUser;
  }
}
