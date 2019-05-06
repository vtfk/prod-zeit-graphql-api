const getData = require('./get-data')
const config = require('../config')
const normalizeDsf = require('tfk-dsf-normalize-contact')

module.exports = async (ids, endpoint) => {
  if (!ids || !Array.isArray(ids)) throw Error('Wrong type or missing required parameter: ids <Array>')

  let dsfData = await Promise.all(ids.map(async id => {
    const options = {
      secret: config.DSF_SERVICE_JWT,
      url: `${config.DSF_SERVICE_URL}/${endpoint}`,
      payload: {
        saksref: 'graphql-common-api',
        foedselsnr: id
      }
    }

    console.log(`| ${id.substr(0, 6)} | DSF - Starting`)
    const resData = getData(options)
    console.log(`| ${id.substr(0, 6)} | DSF - Done`)
    return resData
  }))
  dsfData = dsfData.map(data => data.RESULT)

  const normalizedDsfData = dsfData.map(data => ({
    ...normalizeDsf(data.HOV),
    FOR: data.FOR ? data.FOR.map(data => (normalizeDsf(data))) : '',
    raw: data
  }))
  return normalizedDsfData
}
