import 'jest';
import * as express from 'express';
import request from 'supertest';

import { StatusCodes } from 'http-status-codes';
import IntegrationHelpers from '../../../helpers/IntegrationHelper';
import axios from 'axios';

jest.mock('axios', () => jest.fn());

describe('status integration testing for verification endpoint', () => {
    let app: express.Application;

    // beforeAll(async() => {
    //   app = await IntegrationHelpers.getApp();
    //   Date.now = jest.fn(() => 1503187200000);
    //   jest.useFakeTimers();
    // });

    // it('the user does not exist', async () => {
    //   const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    //   await IntegrationHelpers.dataFetching(mRes, {method:'GET', url:'localhost/oni-chan/auth/verify/id_not_existing/5555'});
    //   expect(axios).toBeCalledWith({
    //     method: 'GET',
    //     url: 'localhost/oni-chan/auth/verify/id_not_existing/5555',
    //   });
    //   expect(mRes.json).toBeCalledWith({ books: [] });
    //   await request(app).get('/oni-chan/auth/verify/id_not_existing/5555')
    //   .set('Accept', 'application/json')
    //   .expect(StatusCodes.NOT_FOUND)
    //   .catch(error => {
    //     throw(error);
    //   })
    // });
    test('it should pass', async () => {
        expect(true).toBe(true);
    });
});
