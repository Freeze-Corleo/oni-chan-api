"use strict";
/**
 * Define App Locals & Configs
 *
 * @author Léo DELPON <leo.delpon@viacesi.fr>
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var dotenv = __importStar(require("dotenv"));
var Locals = /** @class */ (function () {
    function Locals() {
    }
    /**
     * Makes env configs available for your app
     * throughout the app's runtime
     */
    Locals.config = function () {
        dotenv.config({ path: path.join(__dirname, '../../.env') });
        var monitorName = process.env.STATUS_MONITOR_NAME || 'status_monitor';
        var url = process.env.APP_URL || "http://localhost:".concat(process.env.PORT);
        var port = process.env.PORT || 4040;
        var mongooseUrl = process.env.MONGOOSE_URL;
        var mslHost = process.env.HOST_MS;
        var msUsername = process.env.USERNAME_MS;
        var msPassword = process.env.PASSWORD_MS;
        var apiPrefix = process.env.API_PREFIX || 'oni-chan';
        var appSecret = process.env.APP_SECRET || 'test-secret-string-for-session';
        return {
            monitorName: monitorName,
            appSecret: appSecret,
            mongooseUrl: mongooseUrl,
            mslHost: mslHost,
            msUsername: msUsername,
            msPassword: msPassword,
            apiPrefix: apiPrefix,
            port: port,
            url: url,
        };
    };
    /**
     * Injects your config to the app's locals
     */
    Locals.init = function (_express) {
        _express.locals.app = this.config();
        return _express;
    };
    return Locals;
}());
exports.default = Locals;
