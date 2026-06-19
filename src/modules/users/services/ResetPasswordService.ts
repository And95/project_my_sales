import { IUserTokensRepository } from "../domain/repositories/IUserTokensRepository";
import { IUsersRepository } from "../domain/repositories/IUserRepositories";
import { isAfter, addHours } from "date-fns";
import AppError from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import { hash } from "bcrypt";

interface IRequest {
  token: string;
  password: string;
}

@injectable()
export default class ResetPasswordService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("UserTokensRepository")
    private userTokensRepository: IUserTokensRepository,
  ) {}
  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);
    if (!userToken) {
      throw new AppError("User token not exists.", 404);
    }

    const user = await this.usersRepository.findById(userToken.user_id);
    if (!user) {
      throw new AppError("User not exists.", 404);
    }

    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);
    if (isAfter(Date.now(), compareDate)) {
      throw new AppError("Token expired.", 401);
    }

    user.password = await hash(password, 10);
    await this.usersRepository.save(user);
  }
}
