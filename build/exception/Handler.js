"use strict";
/**
 * Define the error & exception handlers
 *
 * @author Léo DELPON <leo.delpon@viacesi.fr>
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Log_1 = __importDefault(require("../middlewares/Log"));
var Local_1 = __importDefault(require("../providers/Local"));
var ExceptionHandler = /** @class */ (function () {
    function ExceptionHandler() {
    }
    ExceptionHandler.logErrors = function () {
    };
    ExceptionHandler.clientErrorHandler = function () {
    };
    ExceptionHandler.errorHandler = function () {
    };
    /**
     * Handle all routes that are not found
     * @param {Application} _express express application
     * @returns {Application}
     */
    ExceptionHandler.notFoundHandler = function (_express) {
        var apiPrefix = Local_1.default.config().apiPrefix;
        _express.use('*', function (req, res) {
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            Log_1.default.error("Path '".concat(req.originalUrl, "' not found [IP: '").concat(ip, "']!"));
            if (req.xhr || req.originalUrl.includes("/".concat(apiPrefix, "/"))) {
                return res.json({
                    error: 'Page Not Found'
                });
            }
            else {
                return res.status(404).json({ code: 404, message: "Page not found" });
            }
        });
        return _express;
    };
    return ExceptionHandler;
}());
exports.default = ExceptionHandler;
