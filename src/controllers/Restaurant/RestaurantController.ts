import express, { Request, Response, NextFunction } from 'express';
import Log from '../../middlewares/Log';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../../types';
import IRestaurant from '../../models/IRestaurant';
import IAddress from '../../models/IAddress';

import AuthTools from '../../../utils/auth';

import Restaurant from '../../models/schema/Restaurant';
import Product from '../../models/schema/Product';
import Customization from '../../models/schema/Customization';
import CategoryProduct from '../../models/schema/CategoryProduct';
import Partner from '../../models/schema/Partner';

import Command from '../../models/schema/Command';

const prisma = new PrismaClient();
class RestaurantController {
    public static async getStatisticsRestaurantsByUserId(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            //get partner from user id
            const partner = await Partner.findOne({ userId: req.query.id }).exec();

            const everyCommands = [];
            const strNowMonth = '0' + (new Date().getMonth() + 1);

            let price = 0;
            let commandCount = 0;
            let restaurantCount = 0;
            let commandCountThisMonth = 0;
            let priceThisMonth = 0;

            for (const restaurant of partner.restaurants) {
                const commands = await Command.find({ restaurantId: restaurant._id });
                restaurantCount += 1;

                if (commands.length !== 0) {
                    console.log(commands);
                    commands.forEach((command) => {
                        price += command.price;
                        commandCount += 1;

                        const han = new Date(command.createdAt).toLocaleDateString();
                        const [day, month, year] = han.toString().split('/');
                        console.log(strNowMonth + '   --  ' + month);
                        if (strNowMonth.toString() == month) {
                            commandCountThisMonth += 1;
                            priceThisMonth += command.price;
                        }
                    });
                }
            }

            const han = {
                totalPrice: price,
                totalCommandCount: commandCount,
                thisMonthCommandCount: commandCountThisMonth,
                thisMonthPrice: priceThisMonth,
                totalRestaurantCount: restaurantCount
            };
            return res.status(200).json(han);
        } catch (error) {
            Log.error('Route :: [/restaurant/statistics :' + error);
            return next(
                new ApiError({
                    status: 500,
                    message: 'Could not retrieve statistics'
                })
            );
        }
    }

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
                console.log(restaurants[0].address);
                const addr = await prisma.address.findFirst({
                    where: { uuid: restaurants[i].address }
                });
                console.log(addr);
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
            const restaurant = await Restaurant.findById(restaurantId).populate({
                path: 'products',
                populate: { path: 'customizationsList' }
            });
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
                isAvailable: restaurant.isAvailable,
                imageUrl: restaurant.imageUrl
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

    public static async deleteRestaurantById(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const restaurantId = req.params.id;
        try {
            let customizationListId;
            const restaurant = await Restaurant.findById(restaurantId);

            // keep it async we don't need it anyway
            prisma.address.delete({ where: { uuid: restaurant.address } });

            const productsId = restaurant.products;
            const productsLength = productsId.length;
            await restaurant.delete();
            for (let i = 0; i < productsLength; ++i) {
                const product = await Product.findById(productsId[i]);
                customizationListId = product.customizationsList;

                // keep it async we don't need it anyway
                CategoryProduct.deleteOne({ _id: product.category });
                product.delete();
            }

            const customizationListLength = customizationListId.length;
            for (let i = 0; i < customizationListLength; ++i) {
                Customization.deleteOne({ _id: customizationListId[i] });
            }

            res.status(200).json(restaurantId);
        } catch (error) {
            Log.error(error);
            return next(
                new ApiError({ status: 500, message: 'Could not delete the restaurant' })
            );
        }
    }

    public static async requestUpdateRestaurantById(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const id = req.params.id;
        const restaurantWanted: IRestaurant = req.body;
        delete restaurantWanted._id;
        console.log('yo', restaurantWanted, id);
        try {
            const updtableRestaurant = await Restaurant.findOneAndUpdate(
                { _id: id },
                restaurantWanted
            );
            if (!updtableRestaurant) {
                throw new Error('No document found');
            }
            console.log('e');
            return res.status(200).json(updtableRestaurant);
        } catch (error) {
            console.log('er', error);
            Log.error(error);
            return JSON.stringify('Cannot update a restaurant');
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
            imageUrl: restaurant.imageUrl,
            _id: restaurant._id
        };

        return restaurantDto;
    }
}
export default RestaurantController;
