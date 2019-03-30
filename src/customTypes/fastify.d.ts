import { IncomingMessage, ServerResponse } from 'http';
import {
  DefaultBody,
  DefaultHeaders,
  DefaultParams,
  DefaultQuery,
  RequestHandler
} from 'fastify';

/**
 * I'm not sure why they didn't default the request and response
 * to IncomingMessage and ServerResponse as the doc mentioned
 */
export interface DefaultRequestHandler<
  Req = IncomingMessage,
  Res = ServerResponse,
  Query = DefaultQuery,
  Params = DefaultParams,
  Headers = DefaultHeaders,
  Body = DefaultBody
> extends RequestHandler<Req, Res, Query, Params, Headers, Body> {}
