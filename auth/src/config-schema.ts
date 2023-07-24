import { Stages } from '@mujtaba-web/common';
import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  STAGE: Joi.string()
    .valid(...Object.values(Stages))
    .required(),
  JWT_SECRET: Joi.string().required(),
});
