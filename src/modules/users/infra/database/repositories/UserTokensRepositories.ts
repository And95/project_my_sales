import { IUserTokensRepository } from "@modules/users/domain/repositories/IUserTokensRepository";
import { IUserToken } from "@modules/users/domain/models/IUserToken";
import { AppDataSource } from "@shared/infra/typeorm/data-source";
import UserToken from "../entities/UserTokens";
import { Repository } from "typeorm";

export class UserTokensRepository implements IUserTokensRepository {
  private ormRepository: Repository<UserToken>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(UserToken);
  }

  public async findByToken(token: string): Promise<IUserToken | null> {
    const userToken = await this.ormRepository.findOneBy({
      token,
    });
    return userToken as IUserToken | null;
  }

  public async generate(user_id: string): Promise<IUserToken> {
    const userToken = this.ormRepository.create({
      user_id: Number(user_id),
    });
    const savedUserToken = await this.ormRepository.save(userToken);
    return savedUserToken as unknown as IUserToken;
  }
}
