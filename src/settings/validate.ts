import Joi from 'joi';

export const passwordValidation = Joi.string().min(6);

export const getJoi = () => {
  return Joi;
};
