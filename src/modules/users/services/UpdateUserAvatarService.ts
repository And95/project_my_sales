import { UsersRepository } from "../infra/database/repositories/UsersRepositories";
import { IUpdateUserAvatar } from "../domain/models/IUpdateUserAvatar";
import { User } from "../infra/database/entities/User";
import AppError from "@shared/errors/AppError";
import uploadConfig from "@config/uploads";
import path from "path";
import fs from "fs";

export default class UpdateUserAvatarService {
  async execute({ user_id, avatarFilename }: IUpdateUserAvatar): Promise<User> {
    const user = await UsersRepository.findById(user_id);

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
