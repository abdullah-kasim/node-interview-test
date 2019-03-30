import { User } from '../../../models/User';
import { Board } from '../../../models/Board';
import { BoardUserType } from '../../../models/BoardUser';

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

  static getBoards = async (user: User) => {};

  static syncBoard = async (uuid: string, name: string) => {};

  static removeBoard = async (uuid: string) => {};

  static addUserToBoard = async (user: User, uuid: string) => {};

  static removeUserFromBoard = async (user: User, uuid: string) => {};
}
