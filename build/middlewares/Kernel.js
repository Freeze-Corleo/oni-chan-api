"use strict";
/**
 * Register your Express middlewares
 *
 * @author Mike Christopher SYLVESTRE <mike.sylvestre@lyknowledge.io>
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var StatusMonitor_1 = __importDefault(require("./StatusMonitor"));
var CORS_1 = __importDefault(require("./CORS"));
var Http_1 = __importDefault(require("./Http"));
var Kernel = /** @class */ (function () {
    function Kernel() {
    }
    Kernel.init = function (_express) {
        // Mount status monitor middleware
        _express = StatusMonitor_1.default.mount(_express);
        // Mount CORS Policy middleware
        _express = CORS_1.default.mount(_express);
        // Mount Http request setting
        _express = Http_1.default.mount(_express);
        return _express;
    };
    return Kernel;
}());
exports.default = Kernel;
