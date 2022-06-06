"use strict";
/**
 * Application for clustered API
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var dotenv = __importStar(require("dotenv"));
var Log_1 = __importDefault(require("../middlewares/Log"));
var Express_1 = __importDefault(require("../providers/Express"));
var Database_1 = require("../providers/Database");
var App = /** @class */ (function () {
    function App() {
    }
    App.prototype.loadConfiguration = function () {
        Log_1.default.info("Configuration :: Loading environment config");
        dotenv.config({ path: path.join(__dirname, '../../.env') });
    };
    App.prototype.loadServer = function () {
        Log_1.default.info("Configuration :: Loading Express server");
        Express_1.default.init();
    };
    App.prototype.loadWorker = function () {
        Log_1.default.info('Worker :: Loading workers at Master node');
    };
    App.prototype.loadDatabase = function () {
        Log_1.default.info("Configuration :: Loading database config");
        Database_1.Database.init();
        Database_1.Database.initMs();
    };
    return App;
}());
exports.default = new App;
