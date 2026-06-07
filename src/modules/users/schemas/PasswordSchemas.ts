import { celebrate, Joi, Segments } from "celebrate";

export const ForgotPasswordSchema = celebrate({
  [Segments.BODY]: {
    email: Joi.string().email().required(),
  },
});

export const ResetPasswordSchema = celebrate({
  [Segments.BODY]: {
    token: Joi.string().uuid().required(),
    password: Joi.string().required(),
    password_confirmation: Joi.string().valid(Joi.ref("password")).required(),
  },
});
