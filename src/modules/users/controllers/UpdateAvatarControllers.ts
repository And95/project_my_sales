import { Request, Response } from "express";
import UpdateUserAvatarService from "../services/UpdateUserAvatarService";

export default class UpdateAvatarControllers {
  update = async (req: Request, res: Response): Promise<Response> => {
    const updateUserAvatar = new UpdateUserAvatarService();

    const avatarFilename = req.file?.filename;

    if (!avatarFilename) {
      throw new Error("Avatar file not provided.");
    }

    const user = await updateUserAvatar.execute({
      userId: Number(req.user.id),
      avatarFilename,
    });

    return res.json(user);
  };
}
