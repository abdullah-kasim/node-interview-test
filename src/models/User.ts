import {
  BelongsToMany,
  Column,
  HasMany,
  Model,
  Table
} from 'sequelize-typescript';
import { Device } from './Device';
import { BoardUser } from './BoardUser';
import { Board } from './Board';

@Table
export class User extends Model<User> {
  @Column
  nickname: string;

  @Column
  email: string;

  @Column
  password: string;

  @Column
  is_firebase_account: boolean;

  @HasMany(() => Device)
  devices: Device[];

  @BelongsToMany(() => Board, () => BoardUser)
  boards: Board[];
}
