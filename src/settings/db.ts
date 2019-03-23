import {Sequelize} from 'sequelize-typescript';

const sequelize =  new Sequelize({
  database: 'some_db',
  dialect: 'postgres',
  username: 'root',
  password: '',
  storage: ':memory:',
  modelPaths: [__dirname + '/models']
});
