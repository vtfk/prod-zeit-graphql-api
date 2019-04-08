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
    console.log('Getting data from DSF...')
    return await getData(options)
  }))

  dsfData = dsfData.map(data => data.RESULT.HOV)
  const normalizedDsfData = dsfData.map(normalizeDsf)
  

  return normalizedDsfData
}
