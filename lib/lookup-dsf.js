const getData = require('./get-data')
const config = require('../config')
const writeFile = require('fs').promises.writeFile

module.exports = async (enpoint, id) => {

  if (!enpoint) throw Error('Missing required parameter: enpoint')
  if (!id) throw Error('Missing required parameter: id')

  const options = {
    secret: config.DSF_SERVICE_JWT,
    url: `${config.DSF_SERVICE_URL}/${enpoint}`,
    payload: {
      saksref: 'graphql-common-api',
      foedselsnr: id
    }
  }
  const dsfData = await getData(options)
  // TODO: Need to restructure data?
  await writeFile('./dsfData.json', JSON.stringify(dsfData, null, 2) , 'utf-8')

  return dsfData
}
