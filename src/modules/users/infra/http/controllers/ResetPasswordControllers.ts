import { IResetPassword } from "@modules/users/domain/models/IResetPassword";
import ResetPasswordService from "../../../services/ResetPasswordService";
import { Request, Response } from "express";

export default class ResetPasswordController {
  create = async (
    request: Request<object, object, IResetPassword>,
    response: Response,
  ): Promise<Response> => {
    const { password, token } = request.body;

    const resetPassword = new ResetPasswordService();

    await resetPassword.execute({
      password,
      token,
    });

    return response.status(204).json();
  };
}
