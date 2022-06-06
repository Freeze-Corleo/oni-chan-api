"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var Local_1 = __importDefault(require("../providers/Local"));
var Route_1 = __importDefault(require("../providers/Route"));
var Log_1 = __importDefault(require("../middlewares/Log"));
var Kernel_1 = __importDefault(require("../middlewares/Kernel"));
var Handler_1 = __importDefault(require("../exception/Handler"));
var Express = /** @class */ (function () {
    /**
     * Initialize the express server
     */
    function Express() {
        this.express = (0, express_1.default)();
        Log_1.default.info("Express :: Mounting process for Express server");
        this.mountMiddlewares();
        this.mountDotEnv();
        this.mountRoutes();
    }
    /**
     * Mount the environment variables
     */
    Express.prototype.mountDotEnv = function () {
        this.express = Local_1.default.init(this.express);
    };
    /**
     * Mount all middlewares for express server
     */
    Express.prototype.mountMiddlewares = function () {
        Kernel_1.default.init(this.express);
    };
    /**
     * Mount the API routes
     */
    Express.prototype.mountRoutes = function () {
        this.express = Route_1.default.mountApi(this.express);
    };
    /**
     * Starts the express server
     */
    Express.prototype.init = function () {
        Log_1.default.info("Express :: Initializing Express server");
        var port = Local_1.default.config().port;
        // Registering Exception / Error Handlers
        this.express.use(Handler_1.default.logErrors);
        this.express.use(Handler_1.default.clientErrorHandler);
        this.express.use(Handler_1.default.errorHandler);
        this.express = Handler_1.default.notFoundHandler(this.express);
        // Start the server on the specified port
        this.express.listen(port, function () {
            return console.log('\x1b[33m%s\x1b[0m', "[INFO] Server :: Running server at 'http://localhost:".concat(port, "'"));
        });
        Log_1.default.info("Express :: Server listening on port ".concat(port));
    };
    return Express;
}());
exports.default = new Express();
