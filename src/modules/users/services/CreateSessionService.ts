import { IUsersRepository } from "../domain/repositories/IUserRepositories";
import { IUser } from "../domain/models/IUser";
import AppError from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import { sign } from "jsonwebtoken";
import { compare } from "bcrypt";
import "reflect-metadata";
import "dotenv/config";

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: IUser;
  token: string;
}

@injectable()
export default class CreateSessionsService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);
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
