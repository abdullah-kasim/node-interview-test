import { IncomingMessage, ServerResponse } from 'http';
import { FastifyReply, FastifyRequest } from 'fastify';
import { DefaultRequestHandler } from '../customTypes/fastify';

export class ResponseHelper {
  static getBase = (
    request: FastifyRequest<IncomingMessage>,
    reply: FastifyReply<ServerResponse>,
    data = null,
    errors = null,
    meta = null
  ) => {
    const payload: any = {
      data,
      errors,
      meta: meta || ResponseHelper.getMeta(request, reply)
    };
    return payload;
  };

  static getMeta = (
    request: FastifyRequest<IncomingMessage>,
    reply: FastifyReply<ServerResponse>
  ) => {
    return {
      url: request.req.url,
      statusCode: reply.res.statusCode,
      hostname: request.hostname,
      timestamp: new Date()
    };
  };

  static validationError = (
    request: FastifyRequest<IncomingMessage>,
    reply: FastifyReply<ServerResponse>,
    errors
  ) => {
    reply.code(422);
    return ResponseHelper.getBase(request, reply, null, errors);
  };

  static create = (
    request: FastifyRequest<IncomingMessage>,
    reply: FastifyReply<ServerResponse>,
    data: any
  ) => {
    reply.code(200);
    return ResponseHelper.getBase(request, reply, data);
  };

  static ok = (
    request: FastifyRequest<IncomingMessage>,
    reply: FastifyReply<ServerResponse>
  ) => {
    reply.code(200);
    return ResponseHelper.getBase(request, reply);
  };
}
