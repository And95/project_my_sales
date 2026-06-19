import SendForgotPasswordEmailService from "../../../services/SendForgotPasswordEmailService";
import { Request, Response } from "express";
import { container } from "tsyringe";

interface IForgotPasswordBody {
  email: string;
}

export default class ForgotPasswordController {
  create = async (
    request: Request<object, object, IForgotPasswordBody>,
    response: Response,
  ): Promise<Response> => {
    const { email } = request.body;
    const sendForgotPasswordEmail = container.resolve(
      SendForgotPasswordEmailService,
    );

    await sendForgotPasswordEmail.execute({ email });
    return response.status(204).json();
  };
}
