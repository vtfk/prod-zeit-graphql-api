const getData = require('./get-data')
const config = require('../config')
const { logger } = require('./tools/logger')

module.exports = async (ids) => {
  if (!ids) throw Error('Missing required parameter: ids <Array>')

  ids = Array.isArray(ids) ? ids : [ids]

  // TODO: Get data for all persons in one request
  const options = {
    azureSecret: config.KOR_SERVICE_JWT,
    url: config.KOR_SERVICE_URL,
    payload: ids
  }
  logger('info', ['lookup-kor', 'ids length', ids.length, 'Start'])
  let requestTimer = Date.now()
  const korData = await getData(options)
  requestTimer = Date.now() - requestTimer
  logger('info', ['lookup-kor', 'time used', `${requestTimer}ms`, 'success'])

  return korData.personer
}
