import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  Unique
} from 'sequelize-typescript';
import { User } from './User';

export enum DeviceType {
  MOBILE = 'MOBILE',
  BROWSER = 'BROWSER'
}

@Table
export class Device extends Model<Device> {
  @ForeignKey(() => User)
  @Column
  user_id: number;

  @BelongsTo(() => User)
  user: User;

  @Column
  refresh_token: string;

  @Column
  type: string | DeviceType;

  @Column
  firebase_cloud_token: string;

  @Unique
  @Column
  device_id: string;

  @Column
  expire_at: Date;
}
