import * as os from 'os';
import * as cluster from 'cluster';

import ClusterEvent from './exception/ClusterEvent';

import App from './providers/App';
import Mail from './controllers/Mailing/Mail';

// if (cluster.default.isPrimary) {
//     /**
//      * Catch the cluster event process
//      */
//     ClusterEvent.process();

//     /**
//      * Load configuration
//      */
//     App.loadConfiguration();

//     /**
//      * Find the number of available CPUS
//      */
//     const CPUS: any = os.cpus();
//     /**
//      * Fork the process, the number of times we have CPUs available
//      */
//     CPUS.forEach(() => cluster.default.fork());

//     /**
//      * Catches the cluster events
//      */
//     ClusterEvent.cluster(cluster.default);

//     /**
//      * Run the Worker every minute
//      * Note: we normally start worker after
//      * the entire app is loaded
//      */
//     setTimeout(() => App.loadWorker(), 1000 * 60);
// } else {
//     // /**
//     //  * Run the Database pool
//     //  */
//     //   App.loadDatabase();

//     /**
//      * Run the Server on Clusters
//      */
//     App.loadServer();
// }

App.loadServer();
App.loadDatabase();
