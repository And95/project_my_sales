import CreateSessionsService from "@modules/users/services/CreateSessionService";
import { instanceToInstance } from "class-transformer";
import { Request, Response } from "express";
import { container } from "tsyringe";

interface SessionBody {
  email: string;
  password: string;
}

export default class SessionsControllers {
  create = async (
    request: Request<object, object, SessionBody>,
    response: Response,
  ): Promise<Response> => {
    const { email, password } = request.body;
    const createSession = container.resolve(CreateSessionsService);
    const user = await createSession.execute({
      email,
      password,
    });

    return response.json(instanceToInstance(user));
  };
}
