import {
  BelongsToMany,
  Column,
  HasMany,
  Model,
  Table
} from 'sequelize-typescript';
import uuidv1 from 'uuid/v1';
import { Device } from './Device';
import { User } from './User';
import { BoardUser } from './BoardUser';
import { Item } from './Item';

@Table
export class Board extends Model<Board> {
  @Column({
    primaryKey: true,
    defaultValue: () => uuidv1()
  })
  id: string;

  @Column
  name: string;

  @BelongsToMany(() => User, () => BoardUser)
  users: User[];

  @HasMany(() => Item)
  items: Item[];
}
