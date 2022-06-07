import { Router } from 'express';
import * as expressJwt from 'express-jwt';

import Locals from '../providers/Local';

import StatusMonitorController from '../controllers/Monitor/StatusController';

const router = Router();

/**
 * Monitoring endpoints
 */
router.get('/status/get-monitor', StatusMonitorController.perform);

export default router;
