/**
 * Define & configure your status monitor
 *
 * @author Léo DELPON <leo.delpon@viacesi.fr>
 */

 import { Application } from 'express';

 import Log from './Log';
 import Locals from '../providers/Local';

 class StatusMonitor {
     public mount(_express: Application): Application {
         Log.info('Status Monitor :: Booting the \'StatusMonitor\' middleware...');

         const api: string = Locals.config().apiPrefix;

         // Define your status monitor config
         const monitorOptions: object = {
             title: Locals.config().monitorName,
             path: '/status-monitor',
             spans: [{
                     interval: 1, // Every second
                     retention: 60 // Keep 60 data-points in memory
                 },
                 {
                     interval: 5,
                     retention: 60
                 },
                 {
                     interval: 15,
                     retention: 60
                 }
             ],
             chartVisibility: {
                 mem: true,
                 rps: true,
                 cpu: true,
                 load: true,
                 statusCodes: true,
                 responseTime: true
             },
             healthChecks: [{
                     protocol: 'http',
                     host: 'localhost',
                     path: '/',
                     port: '4040'
                 },
                 {
                     protocol: 'http',
                     host: 'localhost',
                     path: `/${api}`,
                     port: '4040'
                 }
             ]
         };

         // Loads the express status monitor middleware
         _express.use(require('express-status-monitor')(monitorOptions));

         return _express;
     }
 }

 export default new StatusMonitor;