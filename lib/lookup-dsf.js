const getData = require('./get-data')
const config = require('../config')
const normalizeDsf = require('tfk-dsf-normalize-contact')
const { logger } = require('./tools/logger')

module.exports = async (ids, endpoint) => {
  if (!ids || !Array.isArray(ids)) throw Error('Wrong type or missing required parameter: ids <Array>')

  let log = {
    processed: 0,
    failed: 0,
    requestTimer: Date.now()
  }
  logger('info', ['lookup-dsf', 'ids length', ids.length, 'endpoint', endpoint, 'Start'])

  let dsfData = await Promise.all(ids.map(async id => {
    const options = {
      secret: config.DSF_SERVICE_JWT,
      url: `${config.DSF_SERVICE_URL}/${endpoint}`,
      payload: {
        saksref: 'graphql-common-api',
        foedselsnr: id
      }
    }

    try {
      //logger('info', ['lookup-dsf', 'id', id.substr(0, 6), 'getData', 'start'])
      const resData = await getData(options)
      //logger('info', ['lookup-dsf', 'id', id.substr(0, 6), 'getData', 'success'])
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
