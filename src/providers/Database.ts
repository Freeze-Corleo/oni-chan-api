/**
 * Implement a Database Class for mongo initializing
 *
 * @author Léo DELPON <leo.delpon@viacesi.fr>
 */

import mongoose from "mongoose";
import mysql from 'mysql';
import { MongoError } from 'mongodb';

import Locals from './Local';
import Log from '../middlewares/Log';

export class Database {
  public static init(): any {
    const strConnection: string = Locals.config().mongooseUrl;

    mongoose.connect(strConnection, (error: MongoError) => {
        // handle the error case
        if (error) {
            Log.error('Database :: Failed to connect to the Mongo server !!');
            throw error;
        } else {
            Log.info('Database :: connected to mongo server at: ' + strConnection);
        }
    });
  }

  public static initMs(): any {
    const host: string = Locals.config().mslHost;
    const user: string = Locals.config().msUsername;
    const password: string = Locals.config().msPassword;

    var con = mysql.createConnection({
      host: host,
      user: user,
      password: password
    });

    con.connect(function(err) {
        // handle the error case
        if (err) {
          Log.error('[-] Failed to connect to the Mongo server!!');
          throw err;
      } else {
          Log.info('connected to mongo server at: ' + host);
      }
    });
  }
}