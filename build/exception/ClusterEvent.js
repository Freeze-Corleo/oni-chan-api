"use strict";
/**
 * Catch all your node env's native event
 *
 * @author Léo DELPON <leo.delpon@viacesi.fr>
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Log_1 = __importDefault(require("../middlewares/Log"));
var ClusterEvent = /** @class */ (function () {
    function ClusterEvent() {
    }
    ClusterEvent.prototype.cluster = function (_cluster) {
        // Catch cluster listening event...
        _cluster.on('listening', function (worker) {
            return Log_1.default.info("Server :: Cluster with ProcessID '".concat(worker.process.pid, "' Connected!"));
        });
        // Catch cluster once it is back online event...
        _cluster.on('online', function (worker) {
            return Log_1.default.info("Server :: Cluster with ProcessID '".concat(worker.process.pid, "' has responded after it was forked! "));
        });
        // Catch cluster disconnect event...
        _cluster.on('disconnect', function (worker) {
            return Log_1.default.info("Server :: Cluster with ProcessID '".concat(worker.process.pid, "' Disconnected!"));
        });
        // Catch cluster exit event...
        _cluster.on('exit', function (worker, code, signal) {
            Log_1.default.info("Server :: Cluster with ProcessID '".concat(worker.process.pid, "' is Dead with Code '").concat(code, ", and signal: '").concat(signal, "'"));
            // Ensuring a new cluster will start if an old one dies
            _cluster.fork();
        });
    };
    ClusterEvent.prototype.process = function () {
        // Catch the Process's uncaught-exception
        process.on('uncaughtException', function (exception) {
            return Log_1.default.error(exception.stack);
        });
        // Catch the Process's warning event
        process.on('warning', function (warning) {
            return Log_1.default.warn(warning.stack);
        });
    };
    return ClusterEvent;
}());
exports.default = new ClusterEvent;
