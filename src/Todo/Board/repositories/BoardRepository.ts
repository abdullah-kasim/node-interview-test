import { Board } from '../../../models/Board';
import { User } from '../../../models/User';

export class BoardRepository {
  static getBoard = async (id: string) => {
    return await Board.findOne({
      include: [
        {
          model: User,
          through: {
            attributes: ['type']
          },
          attributes: ['id', 'nickname'],
          required: false
        }
      ],
      where: {
        id
      }
    });
  };
}
