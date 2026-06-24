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

export default class UsersControllers {
  public index = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    const page = Number(request.query.page) || 1;
    const skip = Number(request.query.skip) || 0;
    const take = Number(request.query.take) || 2;
    const listUser = container.resolve(ListUserService);
    const users = await listUser.execute({
      page,
      skip,
      take,
    });

    return response.json(instanceToInstance(users));
  };

  public create = async (
    request: Request<object, object, ICreateUserBody>,
    response: Response,
  ): Promise<Response> => {
    const { name, email, password } = request.body;
    const createUser = container.resolve(CreateUserService);
    const user = await createUser.execute({
      name,
      email,
      password,
    });

    return response.json(instanceToInstance(user));
  };
}
