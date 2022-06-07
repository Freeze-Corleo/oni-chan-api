/**
 * Implement abstract class for api controllers
 */

abstract class Api {
    protected static getApiToken(req): string {
        return req.headers.authorization &&
            req.headers.authorization.split(' ')[0] === 'Basic'
            ? req.headers.authorization.split(' ')[1]
            : req.query && req.query.token
            ? req.query.token
            : '';
    }
}
