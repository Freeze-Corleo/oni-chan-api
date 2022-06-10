import 'jest';
import * as express from 'express';
import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import IntegrationHelpers from '../../../helpers/IntegrationHelper';

describe('status integration testing for status-monitoring endpoint', () => {
    let app: express.Application;

    beforeAll(async () => {
        app = await IntegrationHelpers.getApp();
        jest.useFakeTimers();
        Date.now = jest.fn(() => 1503187200000);
    });

    it('it can get the monitoring status', async () => {
        await request(app)
            .get('/oni-chan/status/get-monitor')
            .set('Accept', 'application/json')
            .expect(StatusCodes.OK);
    });
});
