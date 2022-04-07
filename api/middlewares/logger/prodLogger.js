const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format

function buildProdLogger(){
    const logFormat = printf(({ level, message, timestamp }) => {
        return `${timestamp} ${level}: ${message}`;
      });
    
    const logger = createLogger({
        level: 'http',
        format: combine(
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            logFormat
        ),
        transports: [
          new transports.File({ filename: 'error.log', level: 'error' }),
          new transports.File({ filename: 'logs.log'}),
        ],
      });

    return logger
}

module.exports = buildProdLogger

