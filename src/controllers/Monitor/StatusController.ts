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
    public static perform(req, res) {
        const pidUsage = require('pidUsage');
        const os = require('os');
        pidUsage(process.pid, (err, stats) => {
            const status: {
                cpu: number;
                memory: number;
                load: number;
                parentProcessId: string;
                processId: string;
            } = { cpu: 0, memory: 0, load: 0, parentProcessId: '', processId: '' };

            status.cpu = stats.cpu; //percentage
            status.memory = stats.memory / 1000000; //bytes -> MB
            status.load = os.loadavg(); //Array of 3 value. [0]=1 minute, [1]=5minites, [2]=15minutes
            status.parentProcessId = stats.ppid; //PPID
            status.processId = stats.pid; //PID

            return res.json(status);
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
