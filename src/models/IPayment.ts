export enum PaymentType {
    // eslint-disable-next-line no-unused-vars
    SUBSCRIPTION,
    // eslint-disable-next-line no-unused-vars
    ONETIME
}
export interface PaymentOptions {
    clientId: string;
    productsId: string[];
    currency: string;
    description: string;
    userSubscriptionId?: string;
    paymentType: PaymentType;
    paymentMethod?: string;
    paymentMethodId?: string;
    paymentMethodType?: string;
    totalPrice?: number;
    metadata?: {
        [key: string]: string;
    };
}

export interface CallbackConfig {
    successUrl?: string;
    failUrl?: string;
    cancelUrl?: string;
    statusUrl?: string;
}
