const getData = require('./get-data')
const { DSF_SERVICE_JWT, DSF_SERVICE_URL } = require('../config')
const normalizeDsf = require('tfk-dsf-normalize-contact')
const { logger } = require('./tools/logger')

module.exports = async (ids, method) => {
  if (!ids || !Array.isArray(ids)) throw Error('Wrong type or missing required parameter: ids <Array>')

  const log = {
    processed: 0,
    failed: 0,
    requestTimer: Date.now()
  }
  logger('info', ['lookup-dsf', 'ids length', ids.length, 'endpoint', method, 'Start'])

  const dsfData = await Promise.all(ids.map(async id => {
    const options = {
      secret: DSF_SERVICE_JWT,
      url: DSF_SERVICE_URL,
      payload: {
        method,
        query: {
          saksref: 'graphql-common-api',
          foedselsnr: id
        }
      }
    }

    try {
      const resData = await getData(options)
      log.requestTimer = Date.now() - log.requestTimer
      log.processed++
      return resData
    } catch (error) {
      logger('error', ['lookup-dsf', 'id', id.substr(0, 6), 'getData', error])
      log.failed++
      return error
    }
  })).catch(error => {
    logger('error', ['lookup-dsf', 'ids processed', log.processed, 'ids failed', log.failed, log.processed, error])
    throw error
  })
  logger('info', ['lookup-dsf', 'time used', `${log.requestTimer}ms`, 'ids processed', log.processed, 'ids failed', log.failed, 'success'])

  const normalizedDsfData = dsfData.map(data => {
    if (data instanceof Error) return data // returns the error
    if (!data || !data.RESULT) return Error('Unknown error in lookup-dsf')
    data = data.RESULT
    return {
      ...normalizeDsf(data.HOV),
      FOR: data.FOR ? data.FOR.map(data => (normalizeDsf(data))) : '',
      raw: data
    }
  })
  return normalizedDsfData
}
