/**
 * Implement a Database Class for mongo initializing
 *
 * @author Léo DELPON <leo.delpon@viacesi.fr>
 */

import mongoose from 'mongoose';
import mysql from 'mysql';
import { MongoError } from 'mongodb';

import Locals from './Local';
import Log from '../middlewares/Log';
import { clearConfigCache } from 'prettier';

export class Database {
    public static init(): any {
        const strConnection: string = Locals.config().mongooseUrl;

        try {
            mongoose.connect(strConnection, (error: MongoError) => {
                // handle the error case
                if (error) {
                    Log.error('Database :: Failed to connect to the Mongo server !!');
                    throw error;
                } else {
                    Log.info('Database :: connected to mongo server');
                }
            });
        } catch (error) {
            Log.error('Database :: Failed to connect to the Mongo server !!');
        }
    }
}
