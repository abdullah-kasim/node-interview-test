import { Column, ForeignKey, HasMany, Model, Table, Unique } from "sequelize-typescript"
import { Device } from "./Device"
import { Board } from "./Board"
import { User } from "./User"

export enum BoardUserType {
  OWNER = "OWNER",
  ADDED = "ADDED"
}

@Table({
  tableName: "board_user"
})
export class BoardUser extends Model<BoardUser> {
  @ForeignKey(() => Board)
  @Column({
    unique: "board_id_user_id"
  })
  board_id: string

  @ForeignKey(() => User)
  @Column({
    unique: "board_id_user_id"
  })
  user_id: number

  @Column
  type: string
}
