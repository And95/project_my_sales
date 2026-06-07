import { UsersRepository } from "../database/repositories/UsersRepositories";
import { User } from "../database/entities/User";
import AppError from "@shared/errors/AppError";
import { compare, hash } from "bcrypt";

interface IUpdateProfile {
  user_id: number;
  name: string;
  email: string;
  password?: string | undefined;
  old_password?: string | undefined;
}

class UpdateProfileService {
  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IUpdateProfile): Promise<User> {
    const user = await UsersRepository.findById(user_id);

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    if (email) {
      const userUpdateEmail = await UsersRepository.findByEmail(email);

      if (userUpdateEmail && userUpdateEmail.id !== user.id) {
        throw new AppError("There is already one user with this email.", 409);
      }

      user.email = email;
    }

    if (password && !old_password) {
      throw new AppError("Old password is required.");
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError("Old password does not match.");
      }

      user.password = await hash(password, 10);
    }

    if (name) {
      user.name = name;
    }

    await UsersRepository.save(user);

    return user;
  }
}

export default UpdateProfileService;
