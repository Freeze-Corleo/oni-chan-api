/**
 * Implement a Database Class for mongo initializing
 *
 * @author Léo DELPON <leo.delpon@viacesi.fr>
 */

import * as mongoose from 'mongoose';
import { MongoError } from 'mongodb';

import Locals from './Local';
import Log from '../middlewares/Log';

export class MongoDatabase {
  public static init(): any {
    const strConnection: string = Locals.config().mongooseUrl;

    mongoose.connect(strConnection, (error: MongoError) => {
        // handle the error case
        if (error) {
            Log.error('[-] Failed to connect to the Mongo server!!');
            throw error;
        } else {
            Log.info('connected to mongo server at: ' + strConnection);
        }
    });

  }
}