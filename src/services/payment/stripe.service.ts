import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import Locals from '../../providers/Local';
import Log from '../../middlewares/Log';

import Product from '../../models/schema/Product';
import { PaymentOptions, CallbackConfig } from '../../models/IPayment';

export const stripe = new Stripe(Locals.config().STRIPE_SK, {
    apiVersion: '2020-08-27'
});

const prisma = new PrismaClient();

export default class StripeService {
    public static async createPaymentIntent(
        opts: PaymentOptions,
        cbs: CallbackConfig
    ): Promise<{ client_secret: string | null; total_price: number | null }> {
        let totalPrice = 0;
        // get the Stripe customer object
        const customer = await StripeService.getCustomer(opts.clientId);
        // crating the total price of the payment intent
        opts.productsId.map(async (productId) => {
            const price = await StripeService.getPrices(productId);
            totalPrice += totalPrice + price.unit_amount;
        });

        if (!customer) {
            const resultPaymentIntent = await stripe.paymentIntents.create({
                customer: customer.id,
                currency: 'eur',
                amount: totalPrice
            });

            return {
                client_secret: resultPaymentIntent.client_secret,
                total_price: totalPrice
            };
        }

        return { client_secret: null, total_price: null };
    }

    // It gets the Stripe customer from Stripe API or create it if does not exist
    public static async getCustomer(_userId: string) {
        let customer = null;
        Log.info(
            `StripeService :: getting stripe customer from user with id: ${_userId}`
        );
        const user = await prisma.user.findUnique({
            where: {
                uuid: _userId
            },
            include: {
                address: true
            }
        });
        if (!user) {
            Log.error('StripeService :: there is not users');
            return customer;
        }

        if (user.customerId) {
            const customers = await stripe.customers.search({
                query: `email:"${user.email}}"`
            });
            if (customers.data.length > 0) [customer] = customers.data;
        }

        // If Stripe customer does not exist, it will be created and will update database
        if (!customer) {
            Log.info(`StripeService :: there is not stripe user, creating one...`);
            const name = `${user.firstname}-${user.lastname}`;
            customer = await stripe.customers.create({
                name: name.length > 1 ? name : 'no_name_given',
                email: user.email,
                phone: user.phone,
                description: `user with id: ${_userId}`
            });

            user.customerId = customer.id;
            const addrListId = user.address.map((addr) => ({ uuid: addr.uuid }));
            const addresses = [...addrListId];
            await prisma.user.update({
                where: {
                    uuid: user.uuid
                },
                data: {
                    ...user,
                    address: {
                        set: addresses.map((addr) => ({ ...addr }))
                    }
                },
                include: {
                    address: true
                }
            });
        }

        return customer;
    }

    // Get a product from za product key and create it if does not exist;
    public static async getProduct(_productId: string, description = '', name = '') {
        let product = null;
        const productMatr = await Product.findById(_productId);

        if (!productMatr) {
            return product;
        }

        Log.info(
            `StripeService :: getting Stripe product from the product key: ${productMatr.productId}`
        );
        const products = await stripe.products.list({});

        if (productMatr.productId !== null) {
            product = products.data.find((p) => p.name === productMatr.productId);
        }
        if (!product) {
            product = await stripe.products.create({
                name: name,
                description: description,
                type: 'good'
            });
            productMatr.productId = product.id;
            await productMatr.save();
            return product;
        } else return product;
    }

    // Get price from stripe API and create if from a product if does not;
    public static async getPrices(_productId: string) {
        const productMatr = await Product.findById(_productId);
        Log.info(
            `StripeService :: getting Stripe price from the product id: ${productMatr.productId}`
        );
        const prices = await stripe.prices.list({
            lookup_keys: [
                productMatr.title + '_' + productMatr.price + '_' + productMatr.productId
            ],
            expand: ['data.product']
        });

        const selectedPrice = prices.data.find(
            (price) => price.unit_amount == productMatr.price
        );

        if (!selectedPrice) {
            Log.info(`StripeService :: not prices found, creating one`);
            const product = await StripeService.getProduct(
                productMatr.id,
                productMatr.itemDescription,
                productMatr.title
            );
            const params = {
                currency: 'eur',
                lookup_key:
                    productMatr.title +
                    '_' +
                    productMatr.price +
                    '_' +
                    productMatr.productId,
                unit_amount: productMatr.price,
                product: product.id
            };

            return await stripe.prices.create(params);
        } else {
            Log.info(`StripeService :: price found retrieving it`);
            return selectedPrice;
        }
    }
}
