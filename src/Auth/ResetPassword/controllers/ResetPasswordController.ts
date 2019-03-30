import Joi from 'joi';
import { DefaultRequestHandler } from '../../../customTypes/fastify';
import { ResponseHelper } from '../../../helpers/ResponseHelper';
import { ResetPasswordService } from '../services/ResetPasswordService';
import { passwordValidation } from '../../../settings/validate';

interface SendResetEmailBody {
  email: string;
}

interface ResetPasswordBody {
  token: string;
  password: string;
}

export class ResetPasswordController {
  static sendResetEmail: DefaultRequestHandler<
    any,
    any,
    any,
    SendResetEmailBody
  > = async (request, reply) => {
    const schema = Joi.object().keys({
      email: Joi.string().required()
    });
    const validation = Joi.validate(request.body, schema, {
      abortEarly: false
    });
    if (validation.error !== null) {
      return ResponseHelper.validationError(request, reply, validation.error);
    }
    await ResetPasswordService.sendResetEmail(request.body.email);
    return ResponseHelper.ok(request, reply);
  };

  static resetPassword: DefaultRequestHandler<
    any,
    any,
    any,
    ResetPasswordBody
  > = async (request, reply) => {
    const schema = Joi.object().keys({
      token: Joi.string().required(),
      password: passwordValidation.required() //
    });

    const validation = Joi.validate(request.body, schema, {
      abortEarly: false
    });

    if (validation.error !== null) {
      return ResponseHelper.validationError(request, reply, validation.error);
    }
    await ResetPasswordService.resetPassword(
      request.body.password,
      request.body.token
    );
    return ResponseHelper.ok(request, reply);
  };
}
