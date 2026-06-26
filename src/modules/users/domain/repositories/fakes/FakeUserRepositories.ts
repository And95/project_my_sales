import { User } from "@modules/users/infra/database/entities/User";
import { IPaginateUser } from "../../models/IPaginateUser";
import { IUsersRepository } from "../IUserRepositories";
import { ICreateUser } from "../../models/ICreateUser";
import { IUser } from "../../models/IUser";

class FakeUserRepository implements IUsersRepository {
  private users: User[] = [];

  public create(userData: ICreateUser): Promise<IUser> {
    const user = new User();
    user.id = Number(this.users.length + 1);
    user.name = userData.name;
    user.email = userData.email;
    user.password = userData.password;
    this.users.push(user);
    return Promise.resolve(user as IUser);
  }

  public save(user: IUser): Promise<void> {
    const findIndex = this.users.findIndex(
      (findUser) => findUser.id === user.id,
    );

    if (findIndex >= 0) {
      this.users[findIndex] = user;
    } else {
      this.users.push(user);
    }

    return Promise.resolve();
  }

  public findByEmail(email: string): Promise<IUser | null> {
    const user = this.users.find((user) => user.email === email);
    return Promise.resolve(user ? (user as IUser) : null);
  }

  public findByName(name: string): Promise<IUser | null> {
    const user = this.users.find((user) => user.name === name);
    return Promise.resolve(user ? (user as IUser) : null);
  }

  public findById(id: string): Promise<IUser | null> {
    const user = this.users.find((user) => String(user.id) === id);
    return Promise.resolve(user ? (user as IUser) : null);
  }

  public findAll({
    page,
    skip,
    take,
  }: {
    page: number;
    skip: number;
    take: number;
  }): Promise<IPaginateUser> {
    const users = this.users.slice(skip, skip + take) as IUser[];
    return Promise.resolve({
      per_page: take,
      total: this.users.length,
      current_page: page,
      data: users,
    });
  }
}

export default FakeUserRepository;
