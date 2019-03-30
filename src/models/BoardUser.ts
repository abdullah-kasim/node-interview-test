import {
  Column,
  ForeignKey,
  HasMany,
  Model,
  Table
} from 'sequelize-typescript';
import { Device } from './Device';
import { Board } from './Board';
import { User } from './User';

enum BoardUserType {
  OWNER = 'OWNER',
  ADDED = 'ADDED'
}

@Table({
  tableName: 'board_user'
})
export class BoardUser extends Model<BoardUser> {
  @ForeignKey(() => Board)
  @Column
  board_id: string;

  @ForeignKey(() => User)
  @Column
  user_id: string;
}
