import { User } from '../../../models/User';
import { Board } from '../../../models/Board';
import { BoardUserType } from '../../../models/BoardUser';
import { BoardRepository } from '../repositories/BoardRepository';

export class BoardService {
  static validateUserOwnsBoard = async (
    user: User,
    boardUuid: string
  ): Promise<boolean> => {
    const board = await Board.findOne({
      include: [
        {
          model: User,
          through: {
            where: {
              type: BoardUserType.OWNER
            }
          },
          where: {
            id: user.id
          }
        }
      ],
      where: {
        id: boardUuid
      }
    });
    return board !== null;
  };

  static validateUserIsMemberOfBoard = async (
    user: User,
    boardUuid: string
  ): Promise<boolean> => {
    const board = await Board.findOne({
      include: [
        {
          model: User,
          where: {
            id: user.id
          }
        }
      ],
      where: {
        id: boardUuid
      }
    });
    return board !== null;
  };

  static getBoards = async (user: User) => {
    return await Board.findAll({
      include: [
        {
          model: User,
          through: {
            attributes: ['type']
          },
          where: {
            id: user.id
          }
        }
      ]
    });
  };

  static createBoard = async (board: Partial<Board>) => {
    await Board.create(board);
    return await Board.findByPk(board.id);
  };

  static syncBoard = async (board: Partial<Board>) => {
    await Board.upsert(board);
    return await Board.findByPk(board.id);
  };

  static deleteBoard = async (boardId: string) => {
    const board = await Board.findOne({
      where: {
        id: boardId
      }
    });
    await board.destroy();
    return true;
  };

  static addUserToBoard = async (user: User, boardId: string) => {
    const board = await Board.findByPk(boardId);
    await board.$add('users', user, {
      through: {
        type: BoardUserType.ADDED
      }
    });
    return await BoardRepository.getBoard(boardId);
  };

  static removeUserFromBoard = async (user: User, boardId: string) => {
    const board = await Board.findByPk(boardId);
    await board.$remove('users', user);
    return await BoardRepository.getBoard(boardId);
  };

  static leaveBoard = async (user: User, boardId: string) => {
    return await BoardService.removeUserFromBoard(user, boardId);
  };
}
