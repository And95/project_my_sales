import ResetPasswordService from "@modules/users/services/ResetPasswordService";
import { Request, Response } from "express";
import { container } from "tsyringe";

interface IResetPasswordBody {
  password: string;
  token: string;
}

export default class ResetPasswordController {
  public async create(
    request: Request<object, object, IResetPasswordBody>,
    response: Response,
  ): Promise<Response> {
    const { password, token } = request.body;
    const resetPassword = container.resolve(ResetPasswordService);
    await resetPassword.execute({
      password,
      token,
    });

    return response.status(204).json();
  }
}
