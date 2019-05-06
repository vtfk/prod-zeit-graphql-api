const getData = require('./get-data')
const config = require('../config')

module.exports = async (ids) => {
  if (!ids) throw Error('Missing required parameter: ids <Array>')

  ids = Array.isArray(ids) ? ids : [ids]

  // TODO: Get data for all persons in one request
  const options = {
    secret: config.KOR_SERVICE_JWT,
    url: config.KOR_SERVICE_URL,
    payload: ids
  }
  console.log(`| ${ids.map(id => id.substr(0, 6))} | KOR - Starting`)
  const korData = await getData(options)
  console.log(`| ${ids.map(id => id.substr(0, 6))} | KOR - Done`)

  return korData.personer
}
