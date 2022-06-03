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

class App {
  public loadConfiguration() {
    Log.info("Configuration :: Loading environment config");
    dotenv.config({ path: path.join(__dirname, '../../.env')});
  }

  public loadServer() {
    Log.info("Configuration :: Loading Express server");
    Express.init();
  }

  public loadWorker(): void {
    Log.info('Worker :: Loading workers at Master node');
  }

  public loadDatabase() {
    Log.info("Configuration :: Loading database config");
    Database.init();
    Database.initMs();
  }
}

export default new App;