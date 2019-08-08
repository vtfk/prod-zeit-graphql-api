if (process.env.LOCAL_DEV) {
  console.log('Local development environment')
  require('dotenv').config()
}

module.exports = {
  LOCAL_DEV: process.env.LOCAL_DEV,
  SERVICE_JWT: process.env.SERVICE_JWT || 'Louie Louie oh no I got to go Louie Louie oh no I got to go',
  SERVICE_JWT_EXPIRY_TIME: process.env.SERVICE_JWT_EXPIRY_TIME || '2m',
  DSF_SERVICE_URL: process.env.DSF_SERVICE_URL || 'https://dsf.service.io',
  DSF_SERVICE_JWT: process.env.DSF_SERVICE_JWT || 'Louie Louie oh no I got to go Louie Louie oh no I got to go',
  KOR_SERVICE_URL: process.env.KOR_SERVICE_URL || 'https://kor.service.io',
  KOR_SERVICE_JWT: process.env.KOR_SERVICE_JWT || 'Louie Louie oh no I got to go Louie Louie oh no I got to go',
  AZURE_TENANT_ID: process.env.AZURE_TENANT_ID,
  OPENID_URL: process.env.OPENID_URL || this.AZURE_TENANT_ID ? `https://login.microsoftonline.com/${this.AZURE_TENANT_ID}/.well-known/openid-configuration` : 'https://login.microsoftonline.com/common/.well-known/openid-configuration',
  IDENTITY_MAPPER_URL: process.env.IDENTITY_MAPPER_URL || 'https://identities.api.minelev.no',
  IDENTITY_MAPPER_JWT: process.env.IDENTITY_MAPPER_JWT || 'Louie Louie oh no I got to go Louie Louie oh no I got to go'
}
