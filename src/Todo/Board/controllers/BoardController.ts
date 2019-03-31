import { FastifyReply, FastifyRequest } from 'fastify';
import { DefaultRequestHandler } from '../../../customTypes/fastify';
import { getJoi } from '../../../settings/validate';
import { ResponseHelper } from '../../../helpers/ResponseHelper';
import { BoardService } from '../services/BoardService';
import { AuthService } from '../../../Auth/services/AuthService';
import { BoardRepository } from '../repositories/BoardRepository';
import { User } from '../../../models/User';

interface BoardCommonParam {
  boardId: string;
}

export class BoardController {
  static validateSyncOrCreate = (
    request: FastifyRequest<any>,
    reply: FastifyReply<any>
  ) => {
    const schema = getJoi()
      .object()
      .keys({
        id: getJoi()
          .string()
          .uuid()
          .required(),
        name: getJoi()
          .string()
          .required()
      });
    const validation = schema.validate(
      {
        ...request.body,
        id: request.params.boardId
      },
      {
        abortEarly: false
      }
    );

    if (validation.error !== null) {
      return ResponseHelper.validationError(request, reply, validation.error);
    }
    return true;
  };

  static createBoard: DefaultRequestHandler<any, BoardCommonParam> = async (
    request,
    reply
  ) => {
    const validation = BoardController.validateSyncOrCreate(request, reply);
    if (validation !== true) {
      return validation;
    }
    const user = await AuthService.getUserFromRequest(request);
    const board = await BoardService.createBoard(user, {
      id: request.params.boardId
    });
    return ResponseHelper.create(request, reply, board);
  };

  static getBoards: DefaultRequestHandler<any, BoardCommonParam> = async (
    request,
    reply
  ) => {
    // nothing to validate

    const user = await AuthService.getUserFromRequest(request);
    const boards = await BoardService.getBoards(user);
    return ResponseHelper.create(request, reply, boards);
  };

  static getBoard: DefaultRequestHandler<any, BoardCommonParam> = async (
    request,
    reply
  ) => {
    const board = await BoardRepository.getBoard(request.params.boardId);
    return ResponseHelper.create(request, reply, board);
  };

  static syncBoard: DefaultRequestHandler<any, BoardCommonParam> = async (
    request,
    reply
  ) => {
    const validation = BoardController.validateSyncOrCreate(request, reply);
    if (validation !== true) {
      return validation;
    }

    const board = await BoardService.syncBoard({
      ...request.body,
      id: request.params.boardId
    });

    return ResponseHelper.create(request, reply, board);
  };

  /**
   * Don't forget to add the middleware to allow only the owner to delete a board
   * @param request
   * @param reply
   */
  static deleteBoard: DefaultRequestHandler<any, BoardCommonParam> = async (
    request,
    reply
  ) => {
    await BoardService.deleteBoard(request.params.boardId);
  };

  static validateAction = (request, reply) => {
    const schema = getJoi()
      .object()
      .keys({
        boardId: getJoi()
          .string()
          .required(),
        userId: getJoi()
          .string()
          .required()
      });

    const validation = schema.validate(
      {
        ...request.body,
        boardId: request.params.boardId
      },
      {
        abortEarly: false
      }
    );

    if (validation.error !== null) {
      return ResponseHelper.validationError(request, reply, validation.error);
    }
    return true;
  };

  static addUserToBoard: DefaultRequestHandler<any, BoardCommonParam> = async (
    request,
    reply
  ) => {
    const validation = BoardController.validateAction(request, reply);
    if (validation !== true) {
      return validation;
    }
    const user = await User.findByPk(request.body.userId);

    const board = await BoardService.addUserToBoard(user, request.body.boardId);
    return ResponseHelper.create(request, reply, board);
  };

  static removeUserFromBoard: DefaultRequestHandler<
    any,
    BoardCommonParam
  > = async (request, reply) => {
    const validation = BoardController.validateAction(request, reply);
    if (validation !== true) {
      return validation;
    }

    const user = await User.findByPk(request.body.userId);
    const isOwner = await BoardService.validateUserOwnsBoard(
      user,
      request.params.boardId
    );
    if (isOwner) {
      // temporary business logic. There are cases where you want to be able to leave the board and transfer ownership
      return ResponseHelper.validationError(request, reply, {
        userId: "You can't remove the owner from the board"
      });
    }
    await BoardService.removeUserFromBoard(user, request.params.boardId);
  };

  static leaveBoard: DefaultRequestHandler<any, BoardCommonParam> = async (
    request,
    reply
  ) => {
    const validation = BoardController.validateAction(request, reply);
    if (validation !== true) {
      return validation;
    }

    const user = await AuthService.getUserFromRequest(request);
    const isOwner = await BoardService.validateUserOwnsBoard(
      user,
      request.params.boardId
    );
    if (isOwner) {
      // temporary business logic. There are cases where you want to be able to leave the board and transfer ownership
      return ResponseHelper.validationError(request, reply, {
        userId: "You can't leave the board as the owner"
      });
    }

    await BoardService.leaveBoard(user, request.params.boardId);
    return ResponseHelper.ok(request, reply);
  };
}
