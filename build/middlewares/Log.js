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
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var winston_1 = __importDefault(require("winston"));
/**
 * Define the Log class to implement log process
 *
 * @author Léo DELPON <leo.delpon@viacesi.fr>
 */
var Log = /** @class */ (function () {
    function Log() {
        this.monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
            "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Decembre"
        ];
        this.today = new Date(Date.now());
        var _dateString = "".concat(this.today.toLocaleString('default', { weekday: 'long' }), " ").concat(this.today.getDay(), " ").concat(this.monthNames[this.today.getMonth()], " ").concat(this.today.getFullYear());
        var _timeString = "".concat(this.today.getHours(), "h-").concat(this.today.getMinutes(), "mins-").concat(this.today.getSeconds(), "s");
        // setting up base directory of where to put the log file
        this.baseDir = path.join(__dirname, '../../.logs/');
        this.fileName = "".concat(_dateString.split(' ').join('-'), ".log");
        this.linePrefix = "[".concat(_dateString, " - ").concat(_timeString, "]");
    }
    /**
     * Adds INFO prefix string to the log string
     * @param _string define the content message in log
     */
    Log.prototype.info = function (_string) {
        this.addLog('INFO', _string);
        this.addConsoleLog("".concat(_string), "info").info(_string);
    };
    /**
   * Adds WARN prefix string to the log string
   * @param _string define the content message in log
   */
    Log.prototype.warn = function (_string) {
        this.addLog('WARN', _string);
        this.addConsoleLog("".concat(_string), "info").warn(_string);
    };
    /**
   * Adds ERROR prefix string to the log string
   * @param _string define the content message in log
   */
    Log.prototype.error = function (_string) {
        this.addLog('ERROR', _string);
        this.addConsoleLog("".concat(_string), "error").error(_string);
    };
    /**
    * Adds CUSTOM prefix string to the log string
    * @param _string define the content message in log
    */
    Log.prototype.custom = function (_custom, _string) {
        this.addLog(_custom, _string);
        this.addConsoleLog("[".concat(_custom, "] ").concat(_string), "info").info(_string);
    };
    /**
     *
     * @param {string} _logType define the type of log message (WARN, ERROR, INFO etc..)
     * @param {string} _string define the content message in log
     */
    Log.prototype.addLog = function (_logType, _string) {
        var _that = this;
        _logType = _logType.toUpperCase();
        fs.open("".concat(_that.baseDir).concat(_that.fileName), 'a', function (_err, _fileDescriptor) {
            if (!_err && _fileDescriptor) {
                // Append to file and close it
                fs.appendFile(_fileDescriptor, "".concat(_that.linePrefix, " [").concat(_logType, "] ").concat(_string, "\n"), function (_err) {
                    if (!_err) {
                        fs.close(_fileDescriptor, function (_err) {
                            if (!_err) {
                                return true;
                            }
                            else {
                                return console.log('\x1b[31m%s\x1b[0m', 'Error closing log file that was being appended');
                            }
                        });
                    }
                    else {
                        return console.log('\x1b[31m%s\x1b[0m', 'Error appending to the log file');
                    }
                });
            }
            else {
                return console.log('\x1b[31m%s\x1b[0m', 'Error cloudn\'t open the log file for appending');
            }
        });
    };
    Log.prototype.addConsoleLog = function (_string, level) {
        var templateFunction = function (_a) {
            var level = _a.level, message = _a.message, timestamp = _a.timestamp;
            return "".concat(timestamp, " [").concat(level, "] ").concat(message);
        };
        var logFormat = winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple(), winston_1.default.format.printf(templateFunction));
        var myCustomLevels = {
            levels: {
                info: 0,
                warn: 1,
                error: 2,
                debug: 3
            },
            colors: {
                info: 'green',
                warn: 'yellow',
                error: 'red',
                debug: 'blue'
            }
        };
        winston_1.default.addColors(myCustomLevels.colors);
        var logger = winston_1.default.createLogger({
            // levels: myCustomLevels.levels,
            transports: [
                //
                // - Write to all logs with level `info` and below to `combined.log`
                // - Write all logs error (and below) to `error.log`.
                //
                // new winston.transports.File({ filename: 'error.log', level: 'error' }),
                // new winston.transports.File({ filename: 'combined.log' }),
                new winston_1.default.transports.Console({
                    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), logFormat)
                })
            ]
        });
        return logger;
    };
    return Log;
}());
exports.default = new Log;
