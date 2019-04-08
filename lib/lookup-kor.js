const getData = require('./get-data')
const config = require('../config')

module.exports = async (id) => {
  if (!id) throw Error('Missing required parameter: id')

  //TODO: Get data for all persons in one request
  const options = {
    secret: config.KOR_SERVICE_JWT,
    url: config.KOR_SERVICE_URL,
    payload: [id]
  }
  const korData = await getData(options)

  const personById = korData.personer.filter(person => (person.personidentifikator === id))[0]

  return personById
}