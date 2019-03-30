import { IncomingMessage, ServerResponse } from 'http';
import { FastifyReply, FastifyRequest } from 'fastify';
import { DefaultRequestHandler } from '../customTypes/fastify';

export class ResponseHelper {
  static getBase = (
    request: FastifyRequest<IncomingMessage>,
    data = null,
    errors = null,
    meta = null
  ) => {
    const payload: any = {
      data,
      errors,
      meta: meta || ResponseHelper.getMeta(request)
    };
    return payload;
  };

  static getMeta = (request: FastifyRequest<IncomingMessage>) => {
    return {
      url: request.req.url,
      hostname: request.hostname,
      requestedAt: new Date()
    };
  };

  static validationError = (
    request: FastifyRequest<IncomingMessage>,
    reply: FastifyReply<ServerResponse>,
    errors
  ) => {
    reply.code(422);
    return ResponseHelper.getBase(request, null, errors);
  };

  static ok = (
    request: FastifyRequest<IncomingMessage>,
    reply: FastifyReply<ServerResponse>
  ) => {
    reply.code(200);
    return ResponseHelper.getBase(request);
  };
}
