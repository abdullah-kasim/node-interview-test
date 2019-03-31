import { DefaultRequestHandler } from '../../../customTypes/fastify';

export class BoardController {
  static getBoards: DefaultRequestHandler = (request, reply) => {};

  static syncBoard: DefaultRequestHandler = (request, reply) => {};

  static removeBoard: DefaultRequestHandler = (request, reply) => {};

  static addUserToBoard: DefaultRequestHandler = (request, reply) => {};

  static removeUserFromBoard: DefaultRequestHandler = (request, reply) => {};
}
