import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  Table
} from 'sequelize-typescript';
import uuidv1 from 'uuid/v1';
import { Device } from './Device';
import { Board } from './Board';

@Table
export class Item extends Model<Item> {
  @Column({
    primaryKey: true,
    defaultValue: () => uuidv1()
  })
  id: string;

  @ForeignKey(() => Board)
  @Column
  board_id: string;

  @Column
  content: string;

  @BelongsTo(() => Board)
  board: Board;
}
