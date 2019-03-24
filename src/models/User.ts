import {Column, HasMany, Model, Table} from "sequelize-typescript";
import {Device} from "./Device";


@Table
export class User extends Model<User> {

  @Column
  nickname: string

  @Column
  email: string

  @Column
  password: string

  @HasMany(() => Device)
  devices: Device[]
}
