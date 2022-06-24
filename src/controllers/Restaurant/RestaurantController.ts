import express, { Request, Response, NextFunction } from 'express';
import Log from '../../middlewares/Log';

import { ApiError } from '../../../types';
import IRestaurant from '../../models/IRestaurant';
import restaurant from '../../models/schema/Restaurant';

class RestaurantController {
    public static async requestGetAll(req: express.Request, res: express.Response) {
        return res.send(await RestaurantController.getAll());
    }

    public static async requestDeleteById(req: express.Request, res: express.Response) {
        return res.send(await RestaurantController.deleteById(String(req.query.id)));
    }

    public static async requestCreateOne(req: express.Request, res: express.Response) {
        console.log('yo', req.body);
        return res.send(await RestaurantController.createOne(req.body));
    }

    private static async getAll() {
        try {
            const allRestaurants = await restaurant.find({}).exec();
            if (!allRestaurants) {
                throw new Error('No document found');
            }
            return JSON.stringify(allRestaurants);
        } catch (error) {
            Log.error(error);
            return JSON.stringify('No restaurant found');
        }
    }

    public static async getById(req: Request, res: Response, next: NextFunction) {}

    private static async deleteById(id: string) {}

    public static async updateById(req: Request, res: Response, next: NextFunction) {}

    private static async createOne(restaurantWanted: IRestaurant) {
        try {
            const createdRestaurant = await new restaurant(restaurantWanted).save();
            if (!createdRestaurant) {
                throw new Error('No document found');
            }
            return JSON.stringify(createdRestaurant);
        } catch (error) {
            Log.error(error);
            return JSON.stringify('Cannot create a new restaurant ' + error);
        }
    }
}
export default RestaurantController;
