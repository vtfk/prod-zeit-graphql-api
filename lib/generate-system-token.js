const jwt = require('jsonwebtoken')
const pkg = require('../package.json')

module.exports = secret => {
  const payload = {
    system: pkg.name,
    version: pkg.version
  }

  const options = {
    expiresIn: '1m',
    issuer: 'https://auth.t-fk.no'
  }

  return `Bearer ${jwt.sign(payload, secret, options)}`
}
