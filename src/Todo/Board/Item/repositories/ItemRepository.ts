import { Item } from "../../../../models/Item"
import { Board } from "../../../../models/Board"

export class ItemRepository {
  static getItemWithBoard = async (id: string) => {
    return await Item.findOne({
      include: [
        {
          model: Board
        }
      ],
      where: {
        id
      }
    })
  }
}
