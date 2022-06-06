"use strict";
/**
 * Implement a Database Class for mongo initializing
 *
 * @author Léo DELPON <leo.delpon@viacesi.fr>
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var mysql_1 = __importDefault(require("mysql"));
var Local_1 = __importDefault(require("./Local"));
var Log_1 = __importDefault(require("../middlewares/Log"));
var Database = /** @class */ (function () {
    function Database() {
    }
    Database.init = function () {
        var strConnection = Local_1.default.config().mongooseUrl;
        mongoose_1.default.connect(strConnection, function (error) {
            // handle the error case
            if (error) {
                Log_1.default.error('Database :: Failed to connect to the Mongo server !!');
                throw error;
            }
            else {
                Log_1.default.info('Database :: connected to mongo server at: ' + strConnection);
            }
        });
    };
    Database.initMs = function () {
        var host = Local_1.default.config().mslHost;
        var user = Local_1.default.config().msUsername;
        var password = Local_1.default.config().msPassword;
        var con = mysql_1.default.createConnection({
            host: host,
            user: user,
            password: password
        });
        con.connect(function (err) {
            // handle the error case
            if (err) {
                Log_1.default.error('[-] Failed to connect to mysql server!!');
                throw err;
            }
            else {
                Log_1.default.info('connected to mysql server at: ' + host);
            }
        });
    };
    return Database;
}());
exports.Database = Database;
