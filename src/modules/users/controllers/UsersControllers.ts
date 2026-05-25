import { Request, Response } from "express";
import ListUserService from "@modules/users/services/ListUserService";
import CreateUserService from "@modules/users/services/CreateUserService";

interface CreateUserBody {
  name: string;
  email: string;
  password: string;
}

export default class UsersController {
  index = async (request: Request, response: Response): Promise<Response> => {
    const listUsers = new ListUserService();

    const users = await listUsers.execute();

    return response.json(users);
  };

  create = async (
    request: Request<object, object, CreateUserBody>,
    response: Response,
  ): Promise<Response> => {
    const { name, email, password } = request.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    return response.json(user);
  };
}
