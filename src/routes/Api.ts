import { Router } from 'express';

import StatusMonitorController from '../controllers/Monitor/StatusController';

import RegisterController from '../controllers/Auth/Register';
import VerificationController from '../controllers/Auth/Verification';
import LoginController from '../controllers/Auth/Login';
import ProductController from '../controllers/ProductController'
const router = Router();

/**
 * Authentication endpoints
 */
router.post('/auth/register', RegisterController.perform);
router.post('/auth/login', LoginController.perform);
router.get('/auth/verify/:id/:emailCode', VerificationController.perform);
router.post('/auth/change-password', LoginController.changePassword);
router.post('/auth/logout', LoginController.logout);
router.post('/auth/password-forgotten', LoginController.forgotPassword);

/**
 * Monitoring endpoints
 */
router.get('/status/get-monitor', StatusMonitorController.perform);
router.get('/status/health-check', StatusMonitorController.healthCheckDB);

/**
 * Products endpoints
 */
router.post('/product/create-one', ProductController.createOne);
router.get('/product/get-all', ProductController.getAll);
router.get('/product/get-by-id', ProductController.getById);
router.delete('/product/delete-by-id', ProductController.deleteById);

export default router;
