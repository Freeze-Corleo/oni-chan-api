import { Router } from 'express';
import passport from 'passport';

import AuthTools from '../../utils/auth/index';

import PrivilegeHandler from './privilege/PrivilegeHandler';

import StatusMonitorController from '../controllers/Monitor/StatusController';

import RegisterController from '../controllers/Auth/Register';
import VerificationController from '../controllers/Auth/Verification';
import LoginController from '../controllers/Auth/Login';
import ProductController from '../controllers/Product/ProductController'
import CategoryProductController from '../controllers/Product/CategoryProductController';
import AllergyController from '../controllers/Product/AllergyController';
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
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req: any, res) => {
        const datas = {
            email: req.user.email,
            phone: req.user.phone,
            verifyUser: 'true',
            status: req.user.status,
            profilUrl: req.user.profilUrl
        };

        const token = AuthTools.generateToken(datas);
        return res
            .cookie('FREEZE_JWT', token, {
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3)
            })
            .redirect('/');
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
router.post('/product/create', ProductController.requestCreateOne);
router.get('/product/get-all', ProductController.requestGetAll);
router.get('/product/get', ProductController.requestGetById);
router.delete('/product/delete', ProductController.requestDeleteById);
router.put('/product/update', ProductController.requestUpdateById);

/**
 * Category products endpoints
 */
router.post('/category-product/create', CategoryProductController.requestCreateOne);
router.get('/category-product/get-all', CategoryProductController.requestGetAll);
router.get('/category-product/get', CategoryProductController.requestGetById);
router.delete('/category-product/delete', CategoryProductController.requestDeleteById);
router.put('/category-product/update', CategoryProductController.requestUpdateById);

/**
 * Allergy products endpoints
 */
router.post('/allergy/create', AllergyController.requestCreateOne);
router.get('/allergy/get-all', AllergyController.requestGetAll);
router.get('/allergy/get', AllergyController.requestGetById);
router.delete('/allergy/delete', AllergyController.requestDeleteById);
router.put('/allergy/update', AllergyController.requestUpdateById);


export default router;
