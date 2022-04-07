const { createLogger, format, transports, log } = require('winston');

function buildDevLogger(){
    const logFormat = format.printf(({ level, message }) => {
        return `${level}: ${message}`;
      });
    
    const logger = createLogger({
        level: 'http',
        format: logFormat,
        transports: [
          new transports.Console()
        ],
      });

    return logger
}

module.exports = buildDevLogger