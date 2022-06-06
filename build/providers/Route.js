"use strict";
/**
 * Implement Route class to mount and use API routes too
 *
 * @author Léo DELPON <leo.delpon@viacesi.fr>
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Local_1 = __importDefault(require("./Local"));
var Log_1 = __importDefault(require("../middlewares/Log"));
var Api_1 = __importDefault(require("./../routes/Api"));
var Route = /** @class */ (function () {
    function Route() {
    }
    Route.prototype.mountApi = function (_express) {
        var apiPrefix = Local_1.default.config().apiPrefix;
        Log_1.default.info('Route :: Mounting API routes');
        return _express.use("/".concat(apiPrefix), Api_1.default);
    };
    return Route;
}());
exports.default = new Route;
