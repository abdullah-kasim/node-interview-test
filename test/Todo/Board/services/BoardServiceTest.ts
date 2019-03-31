import test from "ava"
import sinon from "sinon"
import { User } from "../../../../src/models/User"
import { BoardService } from "../../../../src/Todo/Board/services/BoardService"
import { Board } from "../../../../src/models/Board"
import { BoardUserType } from "../../../../src/models/BoardUser"
import { BoardRepository } from "../../../../src/Todo/Board/repositories/BoardRepository"
import { BoardMiddleware } from "../../../../src/Todo/Board/middlewares/BoardMiddleware"
import { fastify } from "../../../../src/settings/http"
import { AuthService } from "../../../../src/Auth/services/AuthService"

test.after(async t => {
  await fastify.close()
})

test.afterEach(() => {
  sinon.restore()
})

test.serial("creates the board with the creator as the owner", async t => {
  const user = sinon.createStubInstance(User)
  user.id = 123
  const board = sinon.createStubInstance(Board)
  board.id = "09de7b00-53cc-11e9-be1a-133465a62776"
  board.name = "abcdef"
  const create = sinon.stub(Board, "create").resolves(board as any)
  sinon.stub(BoardRepository, "getBoard").resolves(board as any)
  // const board = await Board.create(boardParam)
  // await board.$add("users", user, {
  //   through: {
  //     type: BoardUserType.OWNER
  //   }
  // })
  // return await BoardRepository.getBoard(board.id)
  await BoardService.createBoard(user as any, {
    id: "09de7b00-53cc-11e9-be1a-133465a62776",
    name: "some board name"
  })
  t.true(board.$add.called)
  t.true(create.called)
})

test.serial("adds user to the board", async t => {
  const user = sinon.createStubInstance(User)
  user.id = 123
  const board = sinon.createStubInstance(Board)
  board.id = "09de7b00-53cc-11e9-be1a-133465a62776"
  board.name = "abcdef"
  const findByPk = sinon.stub(Board, "findByPk").resolves(board as any)
  sinon.stub(BoardRepository, "getBoard").resolves(board as any)

  const returnedBoard = await BoardService.addUserToBoard(user as any, board.id)
  t.true(board.$add.called)
  t.true(findByPk.called)
})

test.serial("disallow non-owners from adding or removing users", async t => {
  // we test the middleware instead
  const user = sinon.createStubInstance(User)
  user.id = 123
  const userFromRequest = sinon.stub(AuthService, "getUserFromRequest").resolves(user as any)
  const validate = sinon.stub(BoardService, "validateUserOwnsBoard").resolves(false)

  fastify.post("/boardBelongsToUser/:boardId", BoardMiddleware.boardBelongsToUser)
  const response = await fastify.inject({
    method: "POST",
    url: "/boardBelongsToUser/09de7b00-53cc-11e9-be1a-133465a62776"
  })
  t.true(validate.called)
  t.true(userFromRequest.called)
  t.true(response.statusCode === 500)
})

test.serial("removes the user from the board", async t => {
  const user = sinon.createStubInstance(User)
  user.id = 123
  const board = sinon.createStubInstance(Board)
  board.id = "09de7b00-53cc-11e9-be1a-133465a62776"
  board.name = "abcdef"
  const findByPk = sinon.stub(Board, "findByPk").resolves(board as any)
  sinon.stub(BoardRepository, "getBoard").resolves(board as any)

  const returnedBoard = await BoardService.removeUserFromBoard(user as any, board.id)
  t.true(board.$remove.called)
  t.true(findByPk.called)
})

test.serial("get all boards for the user", async t => {
  const user = sinon.createStubInstance(User)
  user.id = 123

  const findAll = sinon.stub(Board, "findAll")

  const returnedBoard = await BoardService.getBoards(user as any)
  t.true(findAll.called)
})
