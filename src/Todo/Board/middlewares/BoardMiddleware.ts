import { DefaultRequestHandler } from '../../../customTypes/fastify';
import { AuthHeader } from '../../../Auth/constants/AuthHeader';
import { InvalidJwtAuthorizationHeader } from '../../../Auth/middlewares/exceptions/InvalidJwtAuthorizationHeader';
import { AuthService } from '../../../Auth/services/AuthService';
import { BoardService } from '../services/BoardService';
import { UserDoesNotOwnBoard } from './exceptions/UserDoesNotOwnBoard';

export class BoardMiddleware {
  static boardBelongsToUser: DefaultRequestHandler = async (request, reply) => {
    const user = await AuthService.getUserFromRequest(request);
    const userOwnsBoard = await BoardService.validateUserOwnsBoard(
      user,
      request.body.id
    );
    if (!userOwnsBoard) {
      throw new UserDoesNotOwnBoard();
    }
  };

  static userIsMemberOfBoard: DefaultRequestHandler = async (
    request,
    reply
  ) => {
    const user = await AuthService.getUserFromRequest(request);

    const userIsMemberOfBoard = await BoardService.validateUserIsMemberOfBoard(
      user,
      request.body.id
    );
    if (!userIsMemberOfBoard) {
      throw new UserDoesNotOwnBoard();
    }
  };
}
