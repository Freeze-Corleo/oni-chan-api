import express, { Request, Response, NextFunction } from 'express';
import Log from '../../middlewares/Log';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../../types';
import IRestaurant from '../../models/IRestaurant';
import IAddress from '../../models/IAddress';

import AuthTools from '../../../utils/auth';

import Restaurant from '../../models/schema/Restaurant';
import Partner from '../../models/schema/Partner';

const prisma = new PrismaClient();
class RestaurantController {
    public static async getAllRestaurant(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const dtoRestaurant = [];
        try {
            const restaurants = await Restaurant.find();
            const restLength = restaurants.length;
            if (restLength == 0) {
                Log.error('Route :: [/restaurant/get-all] there is not restaurants');
                return next(new ApiError({ status: 404, message: 'No restaurants' }));
            }
            for (let i = 0; i < restLength; ++i) {
                const addr = await prisma.address.findFirst({
                    where: { uuid: restaurants[i].address }
                });
                const data = RestaurantController.toDto(restaurants[i], addr);
                dtoRestaurant.push(data);
            }
            return res.status(200).json(dtoRestaurant);
        } catch (error) {
            Log.error('Route :: [/restaurant/get-all :' + error);
            return next(
                new ApiError({
                    status: 500,
                    message: 'Could retrieve restaurants'
                })
            );
        }
    }

    public static async getRestaurantById(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const restaurantId = req.params.id;
        try {
            const restaurant = await Restaurant.findById(restaurantId);
            if (!restaurant) {
                Log.error('Route :: [/restaurant/get/:id] there is not restaurant');
                return res.status(200).json(restaurant);
            }

            const addr = await prisma.address.findFirst({
                where: { uuid: restaurant.address }
            });
            const restaurantDto = RestaurantController.toDto(restaurant, addr);

            return res.status(200).json(restaurantDto);
        } catch (error) {
            Log.error('Route :: [/restaurant/get/:id :' + error);
            return next(
                new ApiError({
                    status: 500,
                    message: 'Could retrieve restaurant'
                })
            );
        }
    }

    public static async getRestaurantsByPartner(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const restaurants = [];
        const userId = req.params.id;
        try {
            const userPartner = await prisma.user.findUnique({ where: { uuid: userId } });
            const partner = await Partner.findOne({ userId: userPartner.uuid }).populate({
                path: 'restaurants'
            });
            if (!partner) {
                Log.error(
                    'Route :: [/restaurant/get-all/partner/:id] there is not partner'
                );
                return next(new ApiError({ status: 404, message: 'No partner found' }));
            }
            const restaurantLength = partner.restaurants.length;
            for (let i = 0; i < restaurantLength; ++i) {
                const addr = await prisma.address.findFirst({
                    where: { uuid: partner.restaurants[i].address }
                });
                const data = RestaurantController.toDto(partner.restaurants[i], addr);
                restaurants.push(data);
            }

            return res.status(200).json(restaurants);
        } catch (error) {
            Log.error('Route :: [/restaurant/get-all/partner/:id:' + error);
            return next(
                new ApiError({
                    status: 500,
                    message: 'Could retrieve restaurants from specific partner'
                })
            );
        }
    }

    public static async createRestaurant(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const userId = req.params.id;
        const { restaurant, address } = req.body;
        const addr = await prisma.address.findMany({
            where: {
                street: address.street
            }
        });

        if (addr.length > 0) {
            Log.error('Route :: [/partner/create] address already in database');
            return next(
                new ApiError({ status: 409, message: 'Address already existing' })
            );
        }

        address.uuid = AuthTools.uuiGenerator();

        addr[0] = await prisma.address.create({
            data: address
        });

        if (!addr[0]) {
            Log.error(
                'Route :: [/restaurant/create] could not create this address, maybe it is already existing'
            );
        }

        try {
            const restaurantCreated = new Restaurant({
                name: restaurant.name,
                rate: restaurant.rate,
                deliveryPrice: restaurant.deliveryPrice,
                address: addr[0].uuid,
                price: restaurant.price,
                cookType: restaurant.cookType,
                products: [],
                isAvailable: restaurant.isAvailable
            });
            const restaurantSaved = await restaurantCreated.save();
            if (!restaurantSaved) {
                return next(
                    new ApiError({
                        status: 500,
                        message: 'Could not create the restaurant'
                    })
                );
            }
            const userPartner = await prisma.user.findUnique({ where: { uuid: userId } });
            await Partner.findOneAndUpdate(
                { userId: userPartner.uuid },
                { $push: { restaurants: restaurantCreated } },
                { returnOriginal: false, upsert: true }
            );

            const data = RestaurantController.toDto(restaurantSaved, addr[0]);
            return res.status(201).json(data);
        } catch (error) {
            Log.error(error);
            return next(
                new ApiError({ status: 500, message: 'Could not create the restaurant' })
            );
        }
    }

    private static toDto(restaurant: IRestaurant, addr: IAddress) {
        const restaurantDto = {
            name: restaurant.name,
            rate: restaurant.rate,
            deliveryPrice: restaurant.deliveryPrice,
            address: addr.street,
            city: addr.city,
            zipCode: addr.zipCode,
            price: restaurant.price,
            cookType: restaurant.cookType,
            isAvailable: restaurant.isAvailable,
            products: restaurant.products,
            _id: restaurant._id
        };

        return restaurantDto;
    }
}
export default RestaurantController;
