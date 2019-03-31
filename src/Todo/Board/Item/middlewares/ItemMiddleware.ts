import { DefaultRequestHandler } from '../../../../customTypes/fastify';
import { AuthService } from '../../../../Auth/services/AuthService';
import { ItemService } from '../services/ItemService';
import { ItemNotEditableByUser } from './exceptions/ItemNotEditableByUser';

export class ItemMiddleware {
  /**
   * An item is editable only if the item belongs to a board that the user belongs to.
   * @param request
   * @param reply
   */
  static itemIsEditable: DefaultRequestHandler = async (request, reply) => {
    const user = await AuthService.getUserFromRequest(request);
    const itemIsEditable = await ItemService.validateItemEditable(
      user,
      request.params.itemId,
      request.params.boardId
    );
    if (!itemIsEditable) {
      throw new ItemNotEditableByUser();
    }
  };
}
