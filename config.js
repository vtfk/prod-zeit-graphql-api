if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

module.exports = {
  DSF_SERVICE_URL: process.env.DSF_SERVICE_URL || 'https://dsf.service.io',
  DSF_SERVICE_JWT: process.env.DSF_SERVICE_JWT || 'Louie Louie oh no I got to go Louie Louie oh no I got to go',
  KOR_SERVICE_URL: process.env.KOR_SERVICE_URL || 'https://kor.service.io',
  KOR_SERVICE_JWT: process.env.KOR_SERVICE_JWT || 'Louie Louie oh no I got to go Louie Louie oh no I got to go'
}