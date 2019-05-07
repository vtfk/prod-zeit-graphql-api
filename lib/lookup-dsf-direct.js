const config = require('../config')
const normalizeDsf = require('tfk-dsf-normalize-contact')
const nodeDsf = require('node-dsf')

module.exports = async (ids, method) => {
  if (!ids || !Array.isArray(ids)) throw Error('Wrong type or missing required parameter: ids <Array>')

  let dsfData = await Promise.all(ids.map(async id => {
    const options = {
      method: method,
      config: config.DSF,
      query: {
        saksref: 'graphql-common-api',
        foedselsnr: id
      }
    }
    try {
      return nodeDsf(options)
    } catch (error) {
      throw error
    }
  }))

  dsfData = dsfData.map(data => data.RESULT)

  const normalizedDsfData = dsfData.map(data => ({
    ...normalizeDsf(data.HOV),
    FOR: data.FOR ? data.FOR.map(data => (normalizeDsf(data))) : '',
    raw: data
  }))
  return normalizedDsfData
}

