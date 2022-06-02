

import * as mongoose from 'mongoose';
import { MongoError } from 'mongodb';

import Locals from './Local';
import Log from '../middlewares/Log';

export class Database {
  public static init(): any {
    const strConnection: string = Locals.config().mongooseUrl;
    const options = { useNewUrlParser: true, useUnifiedTopology: true };

    mongoose.connect(strConnection, options, (error: MongoError) => {
        // handle the error case
        if (error) {
            Log.info('Failed to connect to the Mongo server!!');
            console.log(error);
            throw error;
        } else {
            Log.info('connected to mongo server at: ' + strConnection);
        }
    });

  }
}