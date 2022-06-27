import { NextFunction, Request, Response } from 'express';

import { ApiError } from '../../../types';
import Log from '../../middlewares/Log';
import StripeService from '../../services/payment/stripe.service';

import { PaymentType } from '../../models/IPayment';

const service = {
    Stripe: StripeService
};

/**
 * Create payment controller
 *
 * @author Léo DELPON <leo.delpon@viacesi.fr>
 */
class CreatePaymentController {
    public static async perform(req: Request, res: Response, next: NextFunction) {
        const userId = req.body.params;
        const { productsId, provider } = req.body;
        try {
            const paymentIntent = await service[provider].createPaymentIntent(
                {
                    clientId: userId,
                    productsId,
                    currency: 'EUR',
                    description: '',
                    paymentType: '',
                    payment: PaymentType.ONETIME
                },
                {}
            );
            if (!paymentIntent.client_secret) {
                Log.error(`Route :: [/payment/create] server error`);
                return next(
                    new ApiError({ status: 500, message: 'No clients secret found' })
                );
            }
            return res.status(200).json(paymentIntent);
        } catch (err) {
            Log.error(`Route :: [/payment/create] server error: ${err}`);
            return next(new ApiError({ status: 500, message: 'Error from server' }));
        }
    }
}

export default CreatePaymentController;
