import AppError from "@shared/errors/AppError";
import { UsersRepository } from "../database/repositories/UsersRepositories";
import { userTokensRepositories } from "../database/repositories/UserTokensRepositories";
import { isAfter, addHours } from "date-fns";
import { hash } from "bcrypt";

interface IResetPassword {
  token: string;
  password: string;
}

class ResetPasswordService {
  public async execute({ token, password }: IResetPassword): Promise<void> {
    const userToken = await userTokensRepositories.findByToken(token);

    if (!userToken) {
      throw new AppError("User token not exists.", 404);
    }

    const user = await UsersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError("User not exists.", 404);
    }

    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError("Token expired.", 401);
    }

    user.password = await hash(password, 10);

    await UsersRepository.save(user);
  }
}

export default ResetPasswordService;
