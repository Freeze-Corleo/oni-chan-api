import { Router } from 'express';
import passport from 'passport';

import AuthTools from '../../utils/auth/index';

import PrivilegeHandler from './privilege/PrivilegeHandler';

import StatusMonitorController from '../controllers/Monitor/StatusController';

import RegisterController from '../controllers/Auth/Register';
import VerificationController from '../controllers/Auth/Verification';
import LoginController from '../controllers/Auth/Login';
import ProductController from '../controllers/Product/ProductController';
import CategoryProductController from '../controllers/Product/CategoryProductController';
import AllergyController from '../controllers/Product/AllergyController';
import UserController from '../controllers/User/UserController';

import ApplyPartnerController from '../controllers/Partner/ApplyPartnerController';
import GetAllPartnersController from '../controllers/Partner/GetAllPartnersController';
import VerifyPartnerController from '../controllers/Partner/ValidatePartnerController';
import RestaurantController from '../controllers/Restaurant/RestaurantController';

import CreatePaymentController from '../controllers/Payment/CreatePayment';

import CreateCategory from '../controllers/CategoryProduct/CreateCategoryProduct';
import GetAllCategories from '../controllers/CategoryProduct/GetAllCategories';

import CreateProductController from '../controllers/Product/CreateProduxctController';
import CommandController from '../controllers/Command/CommandController';

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
router.post('/product/create-product', CreateProductController.performProduct);
router.get('/product/get-all', ProductController.requestGetAll);
router.get('/product/get', ProductController.requestGetById);
router.delete('/product/delete', ProductController.requestDeleteById);
router.put('/product/update', ProductController.requestUpdateById);

/**
 * Command endpoints
 */
router.get('/command/get-all', CommandController.getAllCommand);
router.post('/command/create/', CommandController.createCommand);

/**
 * Restaurant endpoints
 */
router.get('/restaurant/get-all', RestaurantController.getAllRestaurant);
router.post('/restaurant/create/:id', RestaurantController.createRestaurant);
router.get(
    '/restaurant/get-all/partner/:id',
    RestaurantController.getRestaurantsByPartner
);
// router.get('/restaurant/get-product', RestaurantController.requestProductGetByRestaurantId);
// router.delete('/restaurant/delete', RestaurantController.requestDeleteById);
// router.put('/restaurant/update', RestaurantController.requestUpdateById);

/**
 * Category products endpoints
 */
router.post('/category-product/create', CreateCategory.perform);
router.get('/category-product/get-all/:id', GetAllCategories.perform);
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

/**
 * User endpoints
 */
router.post('/user/create', UserController.requestCreateOne);
router.get('/', function (req, res) {
    console.log(req.body);
    console.log(req.session);
    return res.send('uuuii');
});

router.get('/user/get-all', UserController.requestGetAll);
router.get('/user/get/:id', UserController.getById);
router.delete('/user/delete', UserController.requestDeleteById);
router.put('/user/update/:id', UserController.updateById);

/**
 * Partner endpoints
 */
router.post('/partner/create', ApplyPartnerController.perform);
router.get('/partner/get-all', GetAllPartnersController.perform);
router.post('/partner/verify/:id', VerifyPartnerController.perform);

/**
 * Stripe payment endpoints
 */
router.post('/payment/payment-intent/:userId', CreatePaymentController.perform);

export default router;
