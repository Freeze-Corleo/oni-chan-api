import { Router } from 'express';
import passport from 'passport';

import PrivilegeHandler from './privilege/PrivilegeHandler';

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
router.post('/auth/change-password', LoginController.changePassword);
router.post('/auth/logout', LoginController.logout);
router.post('/auth/password-forgotten', LoginController.forgotPassword);

/**
 * Google Authentication endpoints
 */
router.get(
    '/auth/google',
    passport.authenticate('google', {
        scope: ['email', 'profile'],
        failureRedirect: '/login'
    })
);

router.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        console.log(req);
        return res.redirect('/account');
    }
);

/**
 * Monitoring endpoints
 */
router.get(
    '/status/get-monitor',
    PrivilegeHandler.isBigMom,
    StatusMonitorController.perform
);
router.get(
    '/status/health-check',
    PrivilegeHandler.isBigMom,
    StatusMonitorController.healthCheckDB
);

export default router;
