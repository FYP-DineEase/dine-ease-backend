import { Stages } from '@dine_ease/common';
import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  STAGE: Joi.string()
    .valid(...Object.values(Stages))
    .required(),
  JWT_SECRET: Joi.string().required(),
});
