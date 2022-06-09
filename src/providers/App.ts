/**
 * Application for clustered API
 *
 * @author Léo DELPON <leo.delpon@viacesi.fr>
 */

import * as path from 'path';
import * as dotenv from 'dotenv';

import Log from '../middlewares/Log';
import Express from '../providers/Express';
import { Database } from '../providers/Database';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class App {
    public loadConfiguration() {
        Log.info('Configuration :: Loading environment config');
        dotenv.config({ path: path.join(__dirname, '../../.env') });
    }

    public loadServer() {
        Log.info('Configuration :: Loading Express server');
        Express.init();
    }

    public loadWorker(): void {
        Log.info('Worker :: Loading workers at Master node');
    }

    public loadDatabase() {
        Log.info('Configuration :: Loading database config');
        Database.init();
    }

    public async test() {
        const allUsers = await prisma.user.findMany();
        Log.info(allUsers.toString());
    }
}

export default new App();
