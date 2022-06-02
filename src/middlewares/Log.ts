import * as fs from 'fs';
import * as path from 'path';
import { createLogger, format, transports } from 'winston';

/**
 * Define the Log class to implement log process
 *
 * @author Léo DELPON <leo.delpon@viacesi.fr>
 */
class Log {
  public baseDir: string;
  public fileName: string;
  public linePrefix: string;

  private monthNames: string[] = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Decembre"
  ];

  private today: Date = new Date(Date.now());

  constructor() {
    let _dateString = `${this.today.toLocaleString('default', {weekday: 'long'})} ${this.today.getDay()} ${this.monthNames[this.today.getMonth()]} ${this.today.getFullYear()}`;
    let _timeString = `${this.today.getHours()}h-${this.today.getMinutes()}mins-${this.today.getSeconds()}s`;

    // setting up base directory of where to put the log file
    this.baseDir = path.join(__dirname, '../../.logs/');
    this.fileName = `${_dateString.split(' ').join('-')}.log`;
    this.linePrefix = `[${_dateString} - ${_timeString}]`
  }

  /**
   * Adds INFO prefix string to the log string
   * @param _string define the content message in log
   */
	public info (_string: string): void {
		this.addLog('INFO', _string);
	}

	/**
   * Adds WARN prefix string to the log string
   * @param _string define the content message in log
   */
	public warn (_string: string): void {
		this.addLog('WARN', _string);
	}

	/**
   * Adds ERROR prefix string to the log string
   * @param _string define the content message in log
   */
	public error (_string: string): void {
		// Line break and show the first line
		console.log('\x1b[31m%s\x1b[0m', '[ERROR] :: ' + _string.split(/r?\n/)[0]);

		this.addLog('ERROR', _string);
	}

   /**
   * Adds CUSTOM prefix string to the log string
   * @param _string define the content message in log
   */
	public custom (_custom: string, _string: string): void {
		this.addLog(_custom, _string);
	}

  public debug (_string: string): void {
    this.addConsoleLog(_string);
  }


  /**
   *
   * @param {string} _logType define the type of log message (WARN, ERROR, INFO etc..)
   * @param {string} _string define the content message in log
   */
  private addLog(_logType: string, _string: string) {
		const _that = this;
		_logType = _logType.toUpperCase();

		fs.open(`${_that.baseDir}${_that.fileName}`, 'a', (_err, _fileDescriptor) => {
			if (!_err && _fileDescriptor) {
				// Append to file and close it
				fs.appendFile(_fileDescriptor, `${_that.linePrefix} [${_logType}] ${_string}\n`, (_err) => {
					if (! _err) {
						fs.close(_fileDescriptor, (_err) => {
							if (! _err) {
								return true;
							} else {
								return console.log('\x1b[31m%s\x1b[0m', 'Error closing log file that was being appended');
							}
						});
					} else {
						return console.log('\x1b[31m%s\x1b[0m', 'Error appending to the log file');
					}
				});
			} else {
				return console.log('\x1b[31m%s\x1b[0m', 'Error cloudn\'t open the log file for appending');
			}
		});
  }

  private addConsoleLog(_string: string) {
    const templateFunction = ({ level, message, timestamp }) =>
    `${timestamp} [${level.toUpperCase()}] ${message}`;

    const logFormat = format.printf(templateFunction);

    const myLevels = {
      info: 2,
      debug: 5,
      error: 0
    }

    const logger = createLogger({
      levels: myLevels,
      transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        // new winston.transports.File({ filename: 'error.log', level: 'error' }),
        // new winston.transports.File({ filename: 'combined.log' }),
        new transports.Console({
          format: format.combine(format.timestamp(), logFormat)
        })
      ]
    });
    return logger.debug(_string);
  }

}

export default new Log;