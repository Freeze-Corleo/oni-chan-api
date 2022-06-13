import { Application, Request, Response, NextFunction } from 'express';
import Log from '../middlewares/Log';

class Formatter {
    public mount(_express: Application): Application {
        _express.use(this.modifyResponseBody);
        return _express;
    }

    private modifyResponseBody(req: Request, res: Response, next: NextFunction) {
        const oldSend = res.send;

        res.send = function (data) {
            Log.info(data);
            data[0] = 'modified : ' + data[0];
            res.send = oldSend; // set function back to avoid the 'double-send'
            return res.json({ status: 200, message: data }); // just call as normal with data
        };
        next(res);
    }
}

export default new Formatter();
