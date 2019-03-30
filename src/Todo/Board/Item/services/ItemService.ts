import { Item } from '../../../../models/Item';
import { User } from '../../../../models/User';
import { Board } from '../../../../models/Board';

export class ItemService {
  static validateItemEditable = async (user: User, itemUuid: string) => {
    const itemEditableByUser = await Item.findOne({
      include: [
        {
          model: Board,
          include: [
            {
              model: User,
              where: {
                id: user.id
              }
            }
          ],
          required: true
        }
      ],
      where: {
        id: itemUuid
      }
    });
    return itemEditableByUser !== null;
  };

  /**
   * We don't really want people changing the board id
   * @param item
   */
  static cleanItem = (item: Partial<Item>) => {
    const { board_id, ...otherItemParams } = item;
    return otherItemParams;
  };

  static syncItem = async (item: Partial<Item>) => {
    await Item.upsert(ItemService.cleanItem(item));
    return await Item.findByPk(item.id);
  };

  static deleteItem = async (id: string) => {
    const item = await Item.findByPk(id);
    if (item) {
      await item.destroy();
    }
    return true;
  };

  static getItems = async (board: Board) => {};
}
