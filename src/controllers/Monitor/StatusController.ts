/**
 * Implement a class that will display internal performance of the machine
 *
 * @author Léo DELPON <leo.delpon@viacesi.fr>
 */
class StatusMonitorController {
    private pidUsage = require('pidUsage');
    private status: {
        cpu: number;
        memory: number;
        parentProcessId: string;
        processId: string;
    } = { cpu: 0, memory: 0, parentProcessId: '', processId: '' };

    public generateState(): void {
        this.pidUsage(process.pid, (err, stats) => {
            this.status.cpu = stats.cpu;
            this.status.parentProcessId = stats.ppid;
            this.status.processId = stats.pid;
        });
    }

    /**
     * Perform cpu and memory data gathering for monitoring
     * @param {any} req
     * @param {any} res
     * @returns {cpu: number, memory: number, parentProcessId: string, processId: string}
     */
    public static perform(req, res) {
        return res.json('nigga');
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
