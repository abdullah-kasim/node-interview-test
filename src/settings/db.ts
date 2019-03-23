import {Sequelize} from 'sequelize-typescript';
import * as configs from './dbConfig'

export const sequelize =  new Sequelize((configs as any).current);
