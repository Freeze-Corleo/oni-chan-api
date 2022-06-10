import * as os from 'os';
import * as cluster from 'cluster';

import ClusterEvent from './exception/ClusterEvent';

import App from './providers/App';
import Locals from './providers/Local';

// if (cluster.default.isPrimary && Locals.config().nodeEnv !== 'test') {
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
//     /**
//      * Run the Database pool
//      */
//     App.loadDatabase();

//     /**
//      * Run the Server on Clusters
//      */
//     App.loadServer();
// }

import Mail from './helpers/SendGridHelper';

Mail.sendEmail(
    'pierre.forques@viacesi.fr',
    { number_one: '5', number_two: '8', number_three: '1', number_four: '7' },
    'd-322b19e59603448da5aab104b70f3cb6'
);
