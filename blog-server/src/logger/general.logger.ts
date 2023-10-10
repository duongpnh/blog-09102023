import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as moment from 'moment';
import 'winston-daily-rotate-file';

import { DateFormat } from '@common/enums/date-format.enum';
import { LogType } from './enums/type.enum';

const transportDailyRotate = new winston.transports.DailyRotateFile({
  filename: 'logs/application-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '5m',
  maxFiles: '14d',
});

@Injectable()
export class GeneralLogger implements LoggerService {
  private _logger: winston.Logger;

  constructor() {
    this.initializeLogger();
  }

  initializeLogger(): void {
    const { format, config, createLogger } = winston;
    const { printf, colorize } = format;
    const colorizer = colorize();

    // Format: <LABEL> - <DD/MM/YYYY HH:mm:ss>     <LEVEL>: "<message>" - "<user agent>"
    const formatLog = (label: string, startAt: string, level: string, message: string) => {
      const dateTime = moment(startAt).format(DateFormat.FULL_DATE_TIME);
      return `${label} - ${dateTime}     ${level.toUpperCase()}: ${message}`;
    };

    const formatConsoleLog = (label: string, startAt: string, level: string, message: string) => {
      const dateTime = moment(startAt).format(DateFormat.FULL_DATE_TIME);
      const labelColorized = colorizer.colorize(level, label);
      const levelColorized = colorizer.colorize(level, level.toUpperCase());
      const msgColorized = colorizer.colorize('lightGrey', message);

      return `${labelColorized} - ${dateTime}     ${levelColorized}: ${msgColorized}`;
    };

    const customFormat = printf(({ timestamp, level, message, label }) => {
      return formatLog(label, timestamp, level, message);
    });
    const customConsoleFormat = printf(({ timestamp, level, message, label }) => {
      return formatConsoleLog(label, timestamp, level, message);
    });
    const { combine, timestamp } = format;

    const customLevel = {
      levels: {
        [LogType.ERROR]: 0,
        [LogType.WARN]: 1,
        [LogType.INFO]: 2,
        [LogType.VERBOSE]: 3,
        [LogType.DEBUG]: 4,
      },
      colors: {
        [LogType.ERROR]: 'bold red',
        [LogType.WARN]: 'bold yellow',
        [LogType.INFO]: 'bold cyan',
        [LogType.VERBOSE]: 'bold green',
        [LogType.DEBUG]: 'bold gray',
      },
    };

    config.addColors(customLevel.colors);

    this._logger = createLogger({
      levels: customLevel.levels,
      format: combine(
        format.label({
          label: '[LOGGER]',
        }),
        timestamp({ format: DateFormat.FULL_DATE_TIME }),
        customFormat,
      ),
      transports: [
        new winston.transports.Console({
          format: combine(
            format.label({
              label: '[LOGGER]',
            }),
            timestamp({
              format: DateFormat.FULL_DATE_TIME,
            }),
            customConsoleFormat,
          ),
        }),
        transportDailyRotate,
      ],
    });
  }

  log(message: string): void {
    this._logger.log(`${[LogType.INFO]}`, message.slice(0, 2000));
  }

  error(message: string): void {
    this._logger.log(`${[LogType.ERROR]}`, message);
  }

  warn(message: string): void {
    this._logger.log(`${[LogType.WARN]}`, message);
  }

  debug(message: string): void {
    this._logger.log(`${[LogType.DEBUG]}`, message);
  }

  verbose(message: string): void {
    this._logger.log(`${[LogType.VERBOSE]}`, message);
  }
}
