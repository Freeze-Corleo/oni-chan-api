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
        return res.send(await RestaurantController.createOne(req.body));
    }

    public static async requestProductGetByRestaurantId(req: express.Request, res: express.Response) {
        return res.send(await RestaurantController.getProductByRestaurantId(String(req.query.id)));
    }

    public static async requestUpdateById(req: express.Request, res: express.Response){
        return res.send(await RestaurantController.updateById(String(req.query.id), req.body));
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

    public static async getProductByRestaurantId(id: string) {
        try {
            const restaurantWanted = await restaurant.findOne({ _id: id }).exec();
            if (!restaurantWanted) {
                throw new Error('No document found');
            }
            return JSON.stringify(restaurantWanted.products);
        } catch (error) {
            Log.error(error);
            return JSON.stringify('No restaurant found');
        }
    }

    private static async deleteById(id: string) {
        try {
            const restaurantFound = await restaurant.deleteOne({ _id: id });
            if(!restaurantFound) {
              throw new Error('No document found');
            }
            return JSON.stringify(restaurantFound);
        } catch (error) {
            Log.error(error);
            return JSON.stringify('Cannot delete restaurant');
        }
    }

    public static async updateById(id: string, restaurantWanted: IRestaurant) {
        try {
            const updatableRestaurant = await restaurant.findOneAndUpdate({_id: id}, restaurantWanted);
            if(!updatableRestaurant) {
              throw new Error('No document found');
            }
            return JSON.stringify(updatableRestaurant);
        } catch (error) {
            Log.error(error);
            return JSON.stringify('Cannot update a restaurant');
        }
    }

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
