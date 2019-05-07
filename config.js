if (process.env.LOCAL_DEV) {require('dotenv').config()}

/* Prep for direct use of DSF API
// ENV checks
if (!process.env.DSF_SYSTEM_NAVN) console.error('Missing required env variable: DSF_SYSTEM_NAVN')
if (!process.env.DSF_BRUKERNAVN) console.error('Missing required env variable: DSF_BRUKERNAVN')
if (!process.env.DSF_PASSORD) console.error('Missing required env variable: DSF_PASSORD')
*/


module.exports = {
  SERVICE_JWT: process.env.SERVICE_JWT || 'Louie Louie oh no I got to go Louie Louie oh no I got to go',
  SERVICE_JWT_EXPIRY_TIME: Number(process.env.SERVICE_JWT) || 120,
  DSF_SERVICE_URL: process.env.DSF_SERVICE_URL || 'https://dsf.service.io',
  DSF_SERVICE_JWT: process.env.DSF_SERVICE_JWT || 'Louie Louie oh no I got to go Louie Louie oh no I got to go',
  KOR_SERVICE_URL: process.env.KOR_SERVICE_URL || 'https://kor.service.io',
  KOR_SERVICE_JWT: process.env.KOR_SERVICE_JWT || 'Louie Louie oh no I got to go Louie Louie oh no I got to go',
/*  DSF: {
    url: process.env.DSF_URL || 'http://ws-test.infotorg.no/xml/ErgoGroup/DetSentraleFolkeregister1_4/2015-08-10/DetSentraleFolkeregister1_4.wsdl',
    namespaceBrukersesjon: process.env.DSF_NAMESPACE || 'http://ws.infotorg.no/xml/Admin/Brukersesjon/2006-07-07/Brukersesjon.xsd',
    distribusjonskanal: process.env.DSF_DIST || 'PTP',
    systemnavn: process.env.DSF_SYSTEM_NAVN || 'systemnavn',
    brukernavn: process.env.DSF_BRUKERNAVN,
    passord: process.env.DSF_PASSORD
  } */
}
