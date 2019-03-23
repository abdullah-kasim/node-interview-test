import {Sequelize} from 'sequelize-typescript';
import * as configs from '../../../src/settings/dbConfig'

// TODO: Create dynamic databases for parallelized testing
export const sequelize =  new Sequelize((configs as any).test);

