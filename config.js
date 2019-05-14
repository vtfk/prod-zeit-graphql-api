if (process.env.LOCAL_DEV) {
  console.log('Local development environment')
  require('dotenv').config()
}

module.exports = {
  LOCAL_DEV: process.env.LOCAL_DEV,
  SERVICE_JWT: process.env.SERVICE_JWT || 'Louie Louie oh no I got to go Louie Louie oh no I got to go',
  SERVICE_JWT_EXPIRY_TIME: Number(process.env.SERVICE_JWT) || 120,
  DSF_SERVICE_URL: process.env.DSF_SERVICE_URL || 'https://dsf.service.io',
  DSF_SERVICE_JWT: process.env.DSF_SERVICE_JWT || 'Louie Louie oh no I got to go Louie Louie oh no I got to go',
  KOR_SERVICE_URL: process.env.KOR_SERVICE_URL || 'https://kor.service.io',
  KOR_SERVICE_JWT: process.env.KOR_SERVICE_JWT || 'Louie Louie oh no I got to go Louie Louie oh no I got to go'
}
