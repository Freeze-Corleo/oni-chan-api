import { Router } from 'express';

import StatusMonitorController from '../controllers/Monitor/StatusController';

import RegisterController from '../controllers/Auth/Register';
import VerificationController from '../controllers/Auth/Verification';

const router = Router();

/**
 * Authentication endpoints
 */
router.post('/auth/register', RegisterController.perform);
router.post('/auth/:id/:emailCode', VerificationController.perform);

/**
 * Monitoring endpoints
 */
router.get('/status/get-monitor', StatusMonitorController.perform);
router.get('/status/healthCheckDB', StatusMonitorController.healthCheckDB);

export default router;
