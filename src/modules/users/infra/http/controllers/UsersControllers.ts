import CreateUserService from "@modules/users/services/CreateUserService";
import { ICreateUser } from "@modules/users/domain/models/ICreateUser";
import ListUserService from "@modules/users/services/ListUserService";
import { instanceToInstance } from "class-transformer";
import { Request, Response } from "express";

export default class UsersController {
  index = async (request: Request, response: Response): Promise<Response> => {
    const listUsers = new ListUserService();
    const users = await listUsers.execute();
    return response.json(instanceToInstance(users));
  };

  create = async (
    request: Request<object, object, ICreateUser>,
    response: Response,
  ): Promise<Response> => {
    const { name, email, password } = request.body;
    const createUser = new CreateUserService();
    const user = await createUser.execute({
      name,
      email,
      password,
    });

    return response.json(instanceToInstance(user));
  };
}
