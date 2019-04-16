const Dataloader = require('dataloader')
const birthdateFromId = require('birthdate-from-id')
const getAge = require('get-age')
const getKor = require('../lookup-kor')
const getDsf = require('../lookup-dsf')

// Caching per request.
module.exports = () => {
  return {
    birthdateFromId: birthdateFromId,
    getAge: getAge,
    getKor: new Dataloader(keys => getKor(keys)),
    getDsf: new Dataloader(keys => getDsf(keys, 'hentDetaljer'))
  }
}