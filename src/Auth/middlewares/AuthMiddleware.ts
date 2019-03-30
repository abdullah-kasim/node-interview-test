import { IncomingMessage, ServerResponse } from 'http';
import {
  DefaultBody,
  DefaultHeaders,
  DefaultParams,
  DefaultQuery,
  FastifyMiddleware,
  RequestHandler
} from 'fastify';
import { DefaultRequestHandler } from '../../customTypes/fastify';
import { InvalidJwtAuthorizationHeader } from './exceptions/InvalidJwtAuthorizationHeader';
import { AuthService } from '../services/AuthService';

// we'll move this out to a separate file some day
enum CustomHeaders {
  FrontendToken = 'Frontend-Token'
}

export class AuthMiddleware {
  /**
   * There's a great debate on whether we should be using the Authorization field, or that we should be using
   * a separate field. A great majority of libraries uses Authorization.
   * But, I'd rather use a separate header. It makes integration with basic auth a lot easier, if needed.
   *
   * @param request
   * @param reply
   */
  static isJwtTokenValid: DefaultRequestHandler = async (request, reply) => {
    // it's a custom header, so there's no need to cater for Bearer
    const authorizationHeader = request.headers[
      CustomHeaders.FrontendToken
    ] as string;
    if (!authorizationHeader) {
      throw new InvalidJwtAuthorizationHeader();
    }
    try {
      AuthService.verifyAndGetJwtToken(authorizationHeader);
    } catch (e) {
      throw new InvalidJwtAuthorizationHeader();
    }
    // ok, verified, let the user in.
  };
}
