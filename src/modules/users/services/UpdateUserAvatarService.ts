import { IUsersRepository } from "../domain/repositories/IUserRepositories";
import { User } from "../infra/database/entities/User";
import AppError from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import uploadConfig from "@config/uploads";
import path from "path";
import fs from "fs";

interface IRequest {
  userId: string;
  avatarFileName: string;
}

@injectable()
export default class UpdateUserAvatarService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
  ) {}
  public async execute({ userId, avatarFileName }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found.", 404);
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);
      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFileName;
    await this.usersRepository.save(user);
    return user;
  }
}
