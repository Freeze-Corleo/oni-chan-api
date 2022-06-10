import { Router } from 'express';

import StatusMonitorController from '../controllers/Monitor/StatusController';

import RegisterController from '../controllers/Auth/Register';
import VerificationController from '../controllers/Auth/Verification';
import LoginController from '../controllers/Auth/Login';

const router = Router();

/**
 * Authentication endpoints
 */
router.post('/auth/register', RegisterController.perform);
router.post('/auth/login', LoginController.perform);
router.get('/auth/verify/:id/:emailCode', VerificationController.perform);

/**
 * Monitoring endpoints
 */
router.get('/status/get-monitor', StatusMonitorController.perform);
router.get('/status/health-check', StatusMonitorController.healthCheckDB);

export default router;
