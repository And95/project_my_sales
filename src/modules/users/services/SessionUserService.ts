import { User } from "../database/entities/User";
import AppError from "@shared/errors/AppError";
import { sign } from "jsonwebtoken";
import { compare } from "bcrypt";
import "dotenv/config";
import { UsersRepository } from "../database/repositories/UsersRepositories";

interface ISessionUser {
  email: string;
  password: string;
}

interface ISessionResponse {
  user: User;
  token: string;
}

class CreateSessionsService {
  async execute({ email, password }: ISessionUser): Promise<ISessionResponse> {
    const user = await UsersRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Incorrect email/password combination.", 401);
    }

    const passwordConfirmed = await compare(password, user.password);

    if (!passwordConfirmed) {
      throw new AppError("Incorrect email/password combination.", 401);
    }

    const token = sign({}, process.env.APP_SECRET as string, {
      subject: String(user.id),
      expiresIn: "1d",
    });

    return {
      user,
      token,
    };
  }
}

export default CreateSessionsService;
