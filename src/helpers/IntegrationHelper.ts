import * as express from 'express';
import Express from '../providers/Express';
import Log from '../middlewares/Log';
import axios, { AxiosRequestConfig } from 'axios';

/**
 * This integration component will run the API on the fly to test particular components.
 *
 * @author Léo DELPON <leo.delpon@viacesi.fr>
 */
export default class IntegrationHelpers {
    public static appInstance: express.Application;
    public static async getApp(): Promise<express.Application> {
        if (this.appInstance) {
            return this.appInstance;
        }
        Express.init();
        this.appInstance = Express.express;
        return this.appInstance;
    }
    public clearDatabase(): void {
        Log.info('Integration helper :: clear Database');
    }

    public static async dataFetching(mainRes, config: AxiosRequestConfig) {
        try {
            const { data } = await axios(config);
            mainRes.status(202).json(data);
        } catch (error) {
            Log.error('Fetch process :: Failed using axios');
        }
    }
}
