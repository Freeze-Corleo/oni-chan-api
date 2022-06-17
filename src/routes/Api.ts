import { Router } from 'express';
import passport from 'passport';

import AuthTools from '../../utils/auth/index';

import PrivilegeHandler from './privilege/PrivilegeHandler';

import StatusMonitorController from '../controllers/Monitor/StatusController';

import RegisterController from '../controllers/Auth/Register';
import VerificationController from '../controllers/Auth/Verification';
import LoginController from '../controllers/Auth/Login';
import ProductController from '../controllers/ProductController';
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
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failed'
    })
);

router.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    (req: any, res) => {
        const datas = {
            email: req.user.email,
            phone: req.user.phone,
            verifyUser: 'true',
            status: req.user.status,
            profilUrl: req.user.profilUrl
        };

        const token = AuthTools.generateToken(datas);
        res.cookie('JWT_TOKEN', token);
        res.redirect(302, `http://localhost:3000/home`);
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

/**
 * Products endpoints
 */
router.post('/product/create-one', ProductController.createOne);
router.get('/product/get-all', ProductController.getAll);
router.get('/product/get-by-id', ProductController.getById);
router.delete('/product/delete-by-id', ProductController.deleteById);

router.get('/', function (req, res) {
    console.log(req.body);
    console.log(req.session);
    return res.send('uuuii');
});

export default router;
