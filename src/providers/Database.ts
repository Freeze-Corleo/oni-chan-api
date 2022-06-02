

import * as mongoose from 'mongoose';
import * as bluebird from 'bluebird';
import { MongoError } from 'mongodb';

import Locals from './Local';
import Log from '../middlewares/Log';

export class Database {
  public static init(): any {
    const strConnection = Locals.config().mongooseUrl;
    const options = { useNewUrlParser: true, useUnifiedTopology: true };

  }
}