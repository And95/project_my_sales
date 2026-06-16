import { Request, Response } from "express";
import ShowProfileService from "@modules/users/services/ShowProfileService";
import UpdateProfileService from "@modules/users/services/UpdateProfileService";

interface IUpdateProfile {
  user_id: number;
  name: string;
  email: string;
  password?: string | undefined;
  old_password?: string | undefined;
}

export default class ProfileController {
  show = async (request: Request, response: Response): Promise<Response> => {
    const showProfile = new ShowProfileService();
    const user_id = Number(request.user.id);
    const user = await showProfile.execute({ user_id });
    return response.json(user);
  };

  update = async (
    request: Request<object, object, IUpdateProfile>,
    response: Response,
  ): Promise<Response> => {
    const user_id = Number(request.user.id);
    const { name, email, password, old_password } = request.body;

    const updateProfile = new UpdateProfileService();
    const user = await updateProfile.execute({
      user_id,
      name,
      email,
      password,
      old_password,
    });

    return response.json(user);
  };
}
