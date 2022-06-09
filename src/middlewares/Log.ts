import * as fs from 'fs';
import * as path from 'path';
import winston from 'winston';

/**
 * Define the Log class to implement log process
 *
 * @author Léo DELPON <leo.delpon@viacesi.fr>
 */
class Log {
    public baseDir: string;
    public fileName: string;
    public linePrefix: string;

    private monthNames: string[] = [
        'Janvier',
        'Février',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Août',
        'Septembre',
        'Octobre',
        'Novembre',
        'Decembre'
    ];

    private today: Date = new Date(Date.now());

    constructor() {
        const _dateString = `${this.today.toLocaleString('default', {
            weekday: 'long'
        })} ${this.today.getDay()} ${
            this.monthNames[this.today.getMonth()]
        } ${this.today.getFullYear()}`;
        const _timeString = `${this.today.getHours()}h-${this.today.getMinutes()}mins-${this.today.getSeconds()}s`;

        // setting up base directory of where to put the log file
        this.baseDir = path.join(__dirname, '../../.logs/');
        this.fileName = `${_dateString.split(' ').join('-')}.log`;
        this.linePrefix = `[${_dateString} - ${_timeString}]`;
    }

    /**
     * Adds INFO prefix string to the log string
     * @param _string define the content message in log
     */
    public info(_string: string): void {
        this.addLog('INFO', _string);
        this.addConsoleLog(`${_string}`, 'info').info(_string);
    }

    /**
     * Adds WARN prefix string to the log string
     * @param _string define the content message in log
     */
    public warn(_string: string): void {
        this.addLog('WARN', _string);
        this.addConsoleLog(`${_string}`, 'info').warn(_string);
    }

    /**
     * Adds ERROR prefix string to the log string
     * @param _string define the content message in log
     */
    public error(_string: string): void {
        this.addLog('ERROR', _string);
        this.addConsoleLog(`${_string}`, 'error').error(_string);
    }

    /**
     * Adds CUSTOM prefix string to the log string
     * @param _string define the content message in log
     */
    public custom(_custom: string, _string: string): void {
        this.addLog(_custom, _string);
        this.addConsoleLog(`[${_custom}] ${_string}`, 'info').info(_string);
    }

    /**
     *
     * @param {string} _logType define the type of log message (WARN, ERROR, INFO etc..)
     * @param {string} _string define the content message in log
     */
    private addLog(_logType: string, _string: string) {
        _logType = _logType.toUpperCase();

        //Create dif if not already created
        if (!fs.existsSync(this.baseDir)) {
            fs.mkdirSync(this.baseDir);
        }
        fs.open(`${this.baseDir}${this.fileName}`, 'a', (_err, _fileDescriptor) => {
            if (!_err && _fileDescriptor) {
                // Append to file and close it
                fs.appendFile(
                    _fileDescriptor,
                    `${this.linePrefix} [${_logType}] ${_string}\n`,
                    (_err) => {
                        if (!_err) {
                            fs.close(_fileDescriptor, (_err) => {
                                if (!_err) {
                                    return true;
                                } else {
                                    return console.log(
                                        '\x1b[31m%s\x1b[0m',
                                        'Error closing log file that was being appended'
                                    );
                                }
                            });
                        } else {
                            return console.log(
                                '\x1b[31m%s\x1b[0m',
                                'Error appending to the log file'
                            );
                        }
                    }
                );
            } else {
                return console.log(
                    '\x1b[31m%s\x1b[0m',
                    "Error cloudn't open the log file for appending"
                );
            }
        });
    }

    private addConsoleLog(_string: string, level: any): winston.Logger {
        const templateFunction = ({ level, message, timestamp }) =>
            `${timestamp} [${level}] ${message}`;
        const logFormat = winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
            winston.format.printf(templateFunction)
        );

        const myCustomLevels = {
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

        winston.addColors(myCustomLevels.colors);

        const logger = winston.createLogger({
            // levels: myCustomLevels.levels,
            transports: [
                //
                // - Write to all logs with level `info` and below to `combined.log`
                // - Write all logs error (and below) to `error.log`.
                //
                // new winston.transports.File({ filename: 'error.log', level: 'error' }),
                // new winston.transports.File({ filename: 'combined.log' }),

                new winston.transports.Console({
                    format: winston.format.combine(winston.format.timestamp(), logFormat)
                })
            ]
        });

        return logger;
    }
}

export default new Log();
