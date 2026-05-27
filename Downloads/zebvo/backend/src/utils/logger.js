/**
 * Logger utility for consistent logging
 */

const LOG_LEVELS = {
  INFO: 'INFO',
  SUCCESS: 'SUCCESS',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG',
};

const LOG_COLORS = {
  INFO: '\x1b[36m%s\x1b[0m',      // Cyan
  SUCCESS: '\x1b[32m%s\x1b[0m',   // Green
  WARNING: '\x1b[33m%s\x1b[0m',   // Yellow
  ERROR: '\x1b[31m%s\x1b[0m',     // Red
  DEBUG: '\x1b[35m%s\x1b[0m',     // Magenta
};

const formatLog = (level, message, data = null) => {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level}]`;

  if (data) {
    return `${prefix} ${message} ${JSON.stringify(data)}`;
  }
  return `${prefix} ${message}`;
};

export const logger = {
  info: (message, data) => {
    console.log(LOG_COLORS.INFO, formatLog(LOG_LEVELS.INFO, message, data));
  },

  success: (message, data) => {
    console.log(LOG_COLORS.SUCCESS, formatLog(LOG_LEVELS.SUCCESS, message, data));
  },

  warning: (message, data) => {
    console.warn(LOG_COLORS.WARNING, formatLog(LOG_LEVELS.WARNING, message, data));
  },

  error: (message, data) => {
    console.error(LOG_COLORS.ERROR, formatLog(LOG_LEVELS.ERROR, message, data));
  },

  debug: (message, data) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(LOG_COLORS.DEBUG, formatLog(LOG_LEVELS.DEBUG, message, data));
    }
  },
};

export default logger;
