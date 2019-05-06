const Dataloader = require('dataloader')
const birthdateFromId = require('birthdate-from-id')
const getAge = require('get-age')
const getKor = require('../lookup-kor')
const getDsf = require('../lookup-dsf')
const getGuardians = require('../get-guardians')
const normalizeContact = require('tfk-dsf-normalize-contact')

// Caching per request.
module.exports = () => {
  return {
    birthdateFromId: birthdateFromId,
    getAge: getAge,
    getGuardians: getGuardians,
    normalizeContact: normalizeContact,
    getKor: new Dataloader(keys => getKor(keys)),
    getDsfDetaljer: new Dataloader(keys => getDsf(keys, 'hentDetaljer')),
    getDsfForeldre: new Dataloader(keys => getDsf(keys, 'hentForeldre'))
  }
}