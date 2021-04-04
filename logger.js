/**
 * @author IITII
 * @date 2020/11/4 19:44
 */
'use strict'
const simpleLogger = require('simple-node-logger'),
  format = 'YYYY-MM-DD HH:mm:ss.SSS',
  opts = {
    // logger.error() will throw a error if you are using 'errorEventName'
    // errorEventName: 'error',
    dateFormat: 'YYYY.MM.DD',
    timestampFormat: format,
    level: process.env.LOG_LEVEL || 'info',
    category: ''
  }

/**
 * logger
 */
function getLogger(category = '') {
  opts.category = category
  return simpleLogger.createSimpleLogger(opts)
}

module.exports = {
  getLogger
}
