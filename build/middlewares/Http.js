"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = __importStar(require("body-parser"));
var Log_1 = __importDefault(require("./Log"));
var Local_1 = __importDefault(require("../providers/Local"));
var cors = require('cors');
var session = require('express-session');
var expressValidator = require('express-validator');
var flash = require('express-flash');
var compress = require('compression');
var Http = /** @class */ (function () {
    function Http() {
    }
    Http.mount = function (_express) {
        Log_1.default.info('Http :: Booting the \'HTTP\' middleware...');
        // Enables the request body parser
        _express.use(bodyParser.json({
            limit: Local_1.default.config().maxUploadLimit
        }));
        _express.use(bodyParser.urlencoded({
            limit: Local_1.default.config().maxUploadLimit,
            parameterLimit: Local_1.default.config().maxParameterLimit,
            extended: false
        }));
        // Disable the x-powered-by header in response
        _express.disable('x-powered-by');
        // Enables the request payload validator
        _express.use(expressValidator());
        // Enables the request flash messages
        _express.use(flash());
        /**
         * Enables the session store
         *
         * Note: You can also add redis-store
         * into the options object.
         */
        var options = {
            resave: true,
            saveUninitialized: true,
            secret: Local_1.default.config().appSecret,
            cookie: {
                maxAge: 1209600000 // two weeks (in ms)
            }
        };
        _express.use(session(options));
        // Enables the CORS
        _express.use(cors());
        // Enables the "gzip" / "deflate" compression for response
        _express.use(compress());
        return _express;
    };
    return Http;
}());
exports.default = Http;
