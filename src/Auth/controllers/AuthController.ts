import { FastifyReply, FastifyRequest } from 'fastify';
import Joi from 'joi';
import { DefaultRequestHandler } from '../../customTypes/fastify';

interface RegisterBody {
  password: string;
  email: string;
  nickname: string;
}

export class AuthController {
  static register: DefaultRequestHandler<any, any, any, RegisterBody> = async (
    request,
    reply
  ) => {
    const schema = Joi.object().keys({
      password: Joi.string()
        .min(6)
        .required(),
      email: Joi.string()
        .min(6)
        .required(),
      nickname: Joi.string()
    });
  };
}
