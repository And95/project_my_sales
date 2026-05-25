import { Request, Response } from "express";
import SessionUserService from "../services/SessionUserService";

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

    const createSession = new SessionUserService();

    const userToken = await createSession.execute({
      email,
      password,
    });

    return response.json(userToken);
  };
}
