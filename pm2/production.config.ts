import {Proc, StartOptions} from "pm2";
import path from 'path';

interface Pm2Config {
  [key: string]: StartOptions
}

const config: Pm2Config = {
  apps: {
    script: path.resolve(__dirname, '../src/server.ts'),
    interpreter: 'node',
    interpreter_args: [
      '-r ts-node/register',
    ],
    instances: 1,
    watch: [path.resolve(__dirname, '../src')],
  }
}

module.exports = config
