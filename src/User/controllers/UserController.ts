import { DefaultRequestHandler } from '../../customTypes/fastify';
import { UserRepository } from '../../repositories/UserRepository';
import { ResponseHelper } from '../../helpers/ResponseHelper';

export class UserController {
  static getUsers: DefaultRequestHandler<any, any, any, any> = async (
    request,
    reply
  ) => {
    const { search = '' } = request.query;
    const users = await UserRepository.getUsers(search);
    return ResponseHelper.create(
      request,
      reply,
      users.map(user => {
        return {
          id: user.id,
          nickname: user.nickname
        };
      })
    );
  };
}
