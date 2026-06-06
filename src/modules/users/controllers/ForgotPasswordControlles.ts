import { Request, Response } from "express";
import SendForgotPasswordEmailService from "../services/SendForgotPasswordEmailService";

interface IForgotPasswordBody {
  email: string;
}

export default class ForgotPasswordController {
  create = async (
    request: Request<object, object, IForgotPasswordBody>,
    response: Response,
  ): Promise<Response> => {
    const { email } = request.body;

    const sendForgotPasswordEmail = new SendForgotPasswordEmailService();

    await sendForgotPasswordEmail.execute({ email });

    return response.status(204).json();
  };
}
