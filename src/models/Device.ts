import {BelongsTo, Column, DataType, ForeignKey, Model, Table, Unique} from "sequelize-typescript";
import {User} from "./User";

enum DeviceType {
  MOBILE = 'MOBILE',
  BROWSER = 'BROWSER'
}

@Table
export class Device extends Model<Device> {

  @ForeignKey(() => User)
  @Column
  user_id: string

  @BelongsTo(() => User)
  user: User

  @Unique
  @Column
  refresh_token: string

  @Column
  type: string | DeviceType

  // one device, one account i hope.
  @Unique
  @Column
  firebase_token: string


  @Unique
  @Column
  device_id: string

  @Column({
    type: 'timestamptz'
  })
  expire_at: Date
}
