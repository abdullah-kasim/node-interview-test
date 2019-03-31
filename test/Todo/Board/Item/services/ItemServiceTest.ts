import test from "ava"
import sinon from "sinon"
import { MailerService } from "../../../../../src/services/MailerService"
import { User } from "../../../../../src/models/User"
import { Board } from "../../../../../src/models/Board"
import { BoardService } from "../../../../../src/Todo/Board/services/BoardService"
import { ItemService } from "../../../../../src/Todo/Board/Item/services/ItemService"
import { Item } from "../../../../../src/models/Item"
import { fastify } from "../../../../../src/settings/http"
import { AuthService } from "../../../../../src/Auth/services/AuthService"
import { BoardMiddleware } from "../../../../../src/Todo/Board/middlewares/BoardMiddleware"
import { ItemMiddleware } from "../../../../../src/Todo/Board/Item/middlewares/ItemMiddleware"

test.after(async t => {
  await fastify.close()
})

test.afterEach(() => {
  sinon.restore()
})

test.serial("get all todo items from the board", async t => {
  const findAll = sinon.stub(Item, "findAll")

  const returnedItems = await ItemService.getItems("09de7b00-53cc-11e9-be1a-133465a62776")
  t.true(findAll.called)
})

test.serial("get a single item from the board", async t => {
  const findByPk = sinon.stub(Item, "findByPk")

  const returnedItems = await ItemService.getItem("09de7b00-53cc-11e9-be1a-133465a62776")
  t.true(findByPk.called)
})

test.serial("create an item and return its details", async t => {
  const itemPayload = sinon.createStubInstance(Item)
  itemPayload.board_id = "09de7b00-53cc-11e9-be1a-133465a62776"
  itemPayload.id = "c19e22a0-53d0-11e9-be1a-133465a62776"
  itemPayload.content = "test content"

  const user = sinon.createStubInstance(User)

  const item = sinon.createStubInstance(Item)
  item.board_id = "09de7b00-53cc-11e9-be1a-133465a62776"
  item.id = "c19e22a0-53d0-11e9-be1a-133465a62776"
  item.content = "test content"

  sinon.stub(ItemService, "sendPushMessage").resolves()
  const create = sinon.stub(Item, "create").resolves(item as any)

  const returnedItem = await ItemService.createItem(user as any, itemPayload as any)
  t.true(create.called)
  // item and returned item must be the same
  t.deepEqual(item, returnedItem as any)
})

test.serial("errors out when non-members try to create", async t => {
  // we test the middleware instead
  const user = sinon.createStubInstance(User)
  user.id = 123
  const userFromRequest = sinon.stub(AuthService, "getUserFromRequest").resolves(user as any)
  const validate = sinon.stub(ItemService, "validateItemEditable").resolves(false)

  fastify.post("/itemIsEditable/board/:boardId/item/:itemId", ItemMiddleware.itemIsEditable)
  const response = await fastify.inject({
    method: "POST",
    url: "/itemIsEditable/board/09de7b00-53cc-11e9-be1a-133465a62776/item/c19e22a0-53d0-11e9-be1a-133465a62776"
  })
  t.true(validate.called)
  t.true(userFromRequest.called)
  t.true(response.statusCode === 500)
})

test.serial("triggers a firebase push notification on create", async t => {
  const itemPayload = sinon.createStubInstance(Item)
  itemPayload.board_id = "09de7b00-53cc-11e9-be1a-133465a62776"
  itemPayload.id = "c19e22a0-53d0-11e9-be1a-133465a62776"
  itemPayload.content = "test content"

  const user = sinon.createStubInstance(User)

  const item = sinon.createStubInstance(Item)
  item.board_id = "09de7b00-53cc-11e9-be1a-133465a62776"
  item.id = "c19e22a0-53d0-11e9-be1a-133465a62776"
  item.content = "test content"

  const push = sinon.stub(ItemService, "sendPushMessage").resolves()
  const create = sinon.stub(Item, "create").resolves(item as any)

  await ItemService.createItem(user as any, itemPayload as any)
  t.true(push.called)
})

test.serial("syncs an item and returns it with the new content", async t => {
  const itemPayload = sinon.createStubInstance(Item)
  itemPayload.board_id = "09de7b00-53cc-11e9-be1a-133465a62776"
  itemPayload.id = "c19e22a0-53d0-11e9-be1a-133465a62776"
  itemPayload.content = "test content"

  const user = sinon.createStubInstance(User)

  const item = sinon.createStubInstance(Item)
  item.board_id = "09de7b00-53cc-11e9-be1a-133465a62776"
  item.id = "c19e22a0-53d0-11e9-be1a-133465a62776"
  item.content = "test content"

  sinon.stub(ItemService, "sendPushMessage").resolves()
  const upsert = sinon.stub(Item, "upsert")
  const findByPk = sinon.stub(Item, "findByPk").resolves(item as any)

  const returnedItem = await ItemService.syncItem(user as any, itemPayload as any)
  t.true(upsert.called)
  t.deepEqual(item, returnedItem as any)
})

test.serial("deletes an item", async t => {
  const user = sinon.createStubInstance(User)

  const item = sinon.createStubInstance(Item)
  item.board_id = "09de7b00-53cc-11e9-be1a-133465a62776"
  item.id = "c19e22a0-53d0-11e9-be1a-133465a62776"
  item.content = "test content"

  sinon.stub(ItemService, "sendPushMessage").resolves()
  const findOne = sinon.stub(Item, "findOne").resolves(item as any)

  const returnedItem = await ItemService.deleteItem(user as any, item.id)
  t.true(findOne.called)
  t.true(item.destroy.called)
})
