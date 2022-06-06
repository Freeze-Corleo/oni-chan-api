"use strict";
/**
 * Enables the CORS
 *
 * @author Léo DELPON <leo.delpon@viacesi.fr>
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Log_1 = __importDefault(require("./Log"));
var Local_1 = __importDefault(require("../providers/Local"));
var CORS = /** @class */ (function () {
    function CORS() {
        this.cors = require('cors');
    }
    CORS.prototype.mount = function (_express) {
        Log_1.default.info('CORS :: Booting the \'CORS\' middleware...');
        var options = {
            origin: Local_1.default.config().url,
            optionsSuccessStatus: 200 // Some legacy browsers choke on 204
        };
        _express.use(this.cors(options));
        return _express;
    };
    return CORS;
}());
exports.default = new CORS;
