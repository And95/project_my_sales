import { celebrate, Joi, Segments } from "celebrate";

export const idParamsValidate = celebrate({
  [Segments.PARAMS]: {
    id: Joi.string().required(),
  },
});

export const createOrderValidate = celebrate({
  [Segments.BODY]: {
    customer_id: Joi.string().required(),
    products: Joi.required(),
  },
});
