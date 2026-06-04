import { UsersRepository } from "../database/repositories/UsersRepositories";
import { User } from "../database/entities/User";
import AppError from "@shared/errors/AppError";
import uploadConfig from "@config/uploads";
import path from "path";
import fs from "fs";

interface IUpdateUserAvatar {
  userId: number;
  avatarFilename: string;
}

export default class UpdateUserAvatarService {
  async execute({ userId, avatarFilename }: IUpdateUserAvatar): Promise<User> {
    const user = await UsersRepository.findById(userId);

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

    user.avatar = avatarFilename;
    await UsersRepository.save(user);
    return user;
  }
}
