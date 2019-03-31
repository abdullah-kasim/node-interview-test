import Joi from "joi"
import { DefaultRequestHandler } from "../../customTypes/fastify"
import { ResponseHelper } from "../../helpers/ResponseHelper"
import { AuthService } from "../services/AuthService"
import { DeviceType } from "../../models/Device"
import { getJoi, passwordValidation } from "../../settings/validate"
import { DeviceRepository } from "../../repositories/DeviceRepository"

interface RegisterBody {
  password: string
  email: string
  nickname: string
}

interface LoginBody {
  email: string
  password: string
  type: DeviceType
  deviceId: string
  firebaseCloudToken?: string
}

interface LogoutBody {
  all: boolean
}

interface RefreshBody {
  refreshToken: string
}

interface UpdateFirebaseCloudTokenBody {
  firebaseCloudToken: string
  refreshToken: string
}

export class AuthController {
  static registerUsingFirebase: DefaultRequestHandler<any, any, any, any> = async (request, reply) => {
    const schema = Joi.object().keys({
      nickname: Joi.string().required(),
      firebaseToken: Joi.string().required()
    })
    const validation = Joi.validate(request.body, schema, {
      abortEarly: false
    })
    if (validation.error !== null) {
      return ResponseHelper.validationError(request, reply, validation.error)
    }
    const { nickname, firebaseToken } = request.body
    try {
      await AuthService.registerUsingFirebase(nickname, firebaseToken)
      return ResponseHelper.ok(request, reply)
    } catch (e) {
      return ResponseHelper.validationError(request, reply, e)
    }
  }

  static loginUsingFirebase: DefaultRequestHandler<any, any, any, any> = async (request, reply) => {
    const schema = Joi.object().keys({
      deviceId: Joi.string().required(),
      type: Joi.string().required(),
      firebaseToken: Joi.string().required(),
      firebaseCloudToken: Joi.string().optional()
    })
    const validation = Joi.validate(request.body, schema, {
      abortEarly: false
    })
    if (validation.error !== null) {
      return ResponseHelper.validationError(request, reply, validation.error)
    }

    const { deviceId, firebaseToken = null, firebaseCloudToken, type } = request.body
    try {
      const tokenDetails = await AuthService.loginUsingFirebase(firebaseToken, type, deviceId, firebaseCloudToken)
      return ResponseHelper.create(request, reply, {
        ...tokenDetails,
        user: AuthService.cleanUser(tokenDetails.user)
      })
    } catch (e) {
      return ResponseHelper.validationError(request, reply, e.message)
    }
  }

  static register: DefaultRequestHandler<any, any, any, RegisterBody> = async (request, reply) => {
    const schema = Joi.object().keys({
      password: passwordValidation.required(),
      email: Joi.string()
        .min(6)
        .email()
        .required(),
      nickname: Joi.string().required()
    })
    const validation = Joi.validate(request.body, schema, {
      abortEarly: false
    })
    if (validation.error !== null) {
      return ResponseHelper.validationError(request, reply, validation.error)
    }
    const { email, nickname, password } = request.body
    try {
      await AuthService.register(nickname, email, password)
      return ResponseHelper.ok(request, reply)
    } catch (e) {
      return ResponseHelper.validationError(request, reply, e.message)
    }
  }

  static login: DefaultRequestHandler<any, any, any, LoginBody> = async (request, reply) => {
    const schema = Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required(),
      deviceId: Joi.string().required(),
      type: Joi.string().required(),
      firebaseCloudToken: Joi.string().optional()
    })
    const validation = Joi.validate(request.body, schema, {
      abortEarly: false
    })
    if (validation.error !== null) {
      return ResponseHelper.validationError(request, reply, validation.error)
    }

    const { email, password, deviceId, firebaseCloudToken = null, type } = request.body
    try {
      const tokenDetails = await AuthService.login(email, password, type, deviceId, firebaseCloudToken)
      return ResponseHelper.create(request, reply, {
        ...tokenDetails,
        user: AuthService.cleanUser(tokenDetails.user)
      })
    } catch (e) {
      return ResponseHelper.validationError(request, reply, e)
    }
  }

  static logout: DefaultRequestHandler<any, any, any, LogoutBody> = async (request, reply) => {
    const schema = Joi.object().keys({
      all: Joi.bool().required()
    })
    const validation = Joi.validate(request.body, schema, {
      abortEarly: false
    })
    if (validation.error !== null) {
      return ResponseHelper.validationError(request, reply, validation.error)
    }

    const user = await AuthService.getUserFromRequest(request)
    if (!user) {
      return ResponseHelper.validationError(request, reply, {
        user: "User is not logged in"
      })
    }

    if (request.body.all) {
      await AuthService.logoutAll(user)
    } else {
      await AuthService.logout(user, user.devices[0])
    }
    return ResponseHelper.ok(request, reply)
  }

  static updateFirebaseCloudToken: DefaultRequestHandler<any, any, any, UpdateFirebaseCloudTokenBody> = async (
    request,
    reply
  ) => {
    const schema = getJoi()
      .object()
      .keys({
        firebaseCloudToken: getJoi()
          .string()
          .required(),
        refreshToken: getJoi()
          .string()
          .required()
      })
    const validation = schema.validate(request.body.refreshToken, {
      abortEarly: false
    })
    if (validation.error !== null) {
      return ResponseHelper.validationError(request, reply, validation.error)
    }

    const device = await DeviceRepository.getDeviceByRefreshToken(request.body.refreshToken)
    await AuthService.updateFirebaseCloudToken(device, request.body.firebaseCloudToken)
  }

  static refresh: DefaultRequestHandler<any, any, any, RefreshBody> = async (request, reply) => {
    const schema = Joi.object().keys({
      refreshToken: Joi.string().required()
    })
    const validation = Joi.validate(request.body, schema, {
      abortEarly: false
    })
    if (validation.error !== null) {
      return ResponseHelper.validationError(request, reply, validation.error)
    }
    try {
      const tokenDetails = await AuthService.renewRefreshToken(request.body.refreshToken)
      return ResponseHelper.create(request, reply, {
        ...tokenDetails,
        user: AuthService.cleanUser(tokenDetails.user)
      })
    } catch (e) {
      return ResponseHelper.validationError(request, reply, e)
    }
  }
}
