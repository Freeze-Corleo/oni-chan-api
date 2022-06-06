"use strict";
/**
 * Define & configure your status monitor
 *
 * @author Léo DELPON <leo.delpon@viacesi.fr>
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Log_1 = __importDefault(require("./Log"));
var Local_1 = __importDefault(require("../providers/Local"));
var StatusMonitor = /** @class */ (function () {
    function StatusMonitor() {
    }
    StatusMonitor.prototype.mount = function (_express) {
        Log_1.default.info('Status Monitor :: Booting the \'StatusMonitor\' middleware...');
        var api = Local_1.default.config().apiPrefix;
        // Define your status monitor config
        var monitorOptions = {
            title: Local_1.default.config().monitorName,
            path: '/status-monitor',
            spans: [{
                    interval: 1,
                    retention: 60 // Keep 60 data-points in memory
                },
                {
                    interval: 5,
                    retention: 60
                },
                {
                    interval: 15,
                    retention: 60
                }
            ],
            chartVisibility: {
                mem: true,
                rps: true,
                cpu: true,
                load: true,
                statusCodes: true,
                responseTime: true
            },
            healthChecks: [{
                    protocol: 'http',
                    host: 'localhost',
                    path: '/',
                    port: '4040'
                },
                {
                    protocol: 'http',
                    host: 'localhost',
                    path: "/".concat(api),
                    port: '4040'
                }
            ]
        };
        // Loads the express status monitor middleware
        _express.use(require('express-status-monitor')(monitorOptions));
        return _express;
    };
    return StatusMonitor;
}());
exports.default = new StatusMonitor;
