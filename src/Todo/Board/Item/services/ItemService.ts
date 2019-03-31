import { Item } from '../../../../models/Item';
import { User } from '../../../../models/User';
import { Board } from '../../../../models/Board';

export class ItemService {
  static validateItemEditable = async (
    user: User,
    itemId: string,
    boardId: string
  ) => {
    const itemEditableByUser = await Item.findOne({
      include: [
        {
          model: Board,
          include: [
            {
              model: User,
              where: {
                id: user.id
              },
              required: true
            }
          ],
          where: {
            id: boardId
          },
          required: true
        }
      ],
      where: {
        id: itemId
      }
    });
    return itemEditableByUser !== null;
  };

  /**
   * We don't really want people changing the board id
   * @param item
   */
  static cleanItem = (item: Partial<Item>) => {
    const { board_id, createdAt, updatedAt, ...otherItemParams } = item;
    return otherItemParams;
  };

  static createItem = async (item: Partial<Item>) => {
    await Item.create(ItemService.cleanItem(item));
    return await Item.findByPk(item.id);
  };

  static syncItem = async (item: Partial<Item>) => {
    await Item.upsert(ItemService.cleanItem(item));
    return await Item.findByPk(item.id);
  };

  static deleteItem = async (itemId: string) => {
    const item = await Item.findByPk(itemId);
    if (item) {
      await item.destroy();
    }
    return true;
  };

  static getItems = async (boardId: string) => {
    return await Item.findAll({
      where: {
        board_id: boardId
      }
    });
  };

  static getItem = async (itemId: string) => {
    return await Item.findByPk(itemId);
  };
}
