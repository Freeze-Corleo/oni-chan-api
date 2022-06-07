/**
 * Implement a class that will display internal performance of the machine
 *
 * @author Léo DELPON <leo.delpon@viacesi.fr>
 */
class StatusMonitorController {

    /**
     * Perform cpu and memory data gathering for monitoring
     * @param {any} req
     * @param {any} res
     * @returns {cpu: number, memory: number, parentProcessId: string, processId: string}
     */
    public static perform(req, res, time) {
        const pidUsage = require('pidUsage');
        var responseTime = require('response-time')

        pidUsage(process.pid, (err, stats) => {

            var status: {
                cpu: number;
                memory: number;
                parentProcessId: string;
                processId: string;
            } = { cpu: 0, memory: 0, parentProcessId: '', processId: '' };

            status.cpu = stats.cpu; //percentage
            status.memory = stats.memory/1000000; //bytes -> MB
            status.parentProcessId = stats.ppid; //PPID
            status.processId = stats.pid; //PID

            return res.json(status)
        });
    }

    public static healthCheckDB(req, res) {
        const healthcheck = {
            uptime: process.uptime(),
            message: 'OK',
            timestamp: Date.now()
        };
        return res.send(healthcheck);
    }
}

export default StatusMonitorController;
