import Joi from 'joi';

export const passwordValidation = Joi.string().min(6);
