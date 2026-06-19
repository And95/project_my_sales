import CreateUserService from "@modules/users/services/CreateUserService";
import ListUserService from "@modules/users/services/ListUserService";
import { instanceToInstance } from "class-transformer";
import { Request, Response } from "express";
import { container } from "tsyringe";

interface ICreateUserBody {
  name: string;
  email: string;
  password: string;
}

export default class UsersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { page, skip, take } = request.query;
    const listUser = container.resolve(ListUserService);
    const users = await listUser.execute({
      page: Number(page),
      skip: Number(skip),
      take: Number(take),
    });

    return response.json(instanceToInstance(users));
  }

  public async create(
    request: Request<object, object, ICreateUserBody>,
    response: Response,
  ): Promise<Response> {
    const { name, email, password } = request.body;
    const createUser = container.resolve(CreateUserService);
    const user = await createUser.execute({
      name,
      email,
      password,
    });

    return response.json(instanceToInstance(user));
  }
}
