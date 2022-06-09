import { Router } from 'express';

import StatusMonitorController from '../controllers/Monitor/StatusController';

import RegisterController from '../controllers/Auth/Register';

const router = Router();

/**
 * Authentication endpoints
 */
router.post('/auth/register', RegisterController.perform);

/**
 * Monitoring endpoints
 */
router.get('/status/get-monitor', StatusMonitorController.perform);
router.get('/status/healthCheckDB', StatusMonitorController.healthCheckDB);

export default router;
