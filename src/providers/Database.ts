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
  public static initMg(): any {
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

  public static initMs(): any {
    var mysql = require('mysql');
    const host: string = Locals.config().mslHost;
    const user: string = Locals.config().msUsername;
    const password: string = Locals.config().msPassword;

    var con = mysql.createConnection({
      host: host,
      user: user,
      password: password
    });
    
    con.connect(function(err) {
      if (err) throw err; //TODO léo ? 
      Log.info('connected to sql server at: ' + host);
    });
  }
}