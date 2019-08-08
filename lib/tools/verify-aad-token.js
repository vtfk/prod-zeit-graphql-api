const axios = require('axios')
const { setupCache } = require('axios-cache-adapter')
const jwt = require('jsonwebtoken')
const { OPENID_URL } = require('../../config')

const cache = setupCache({
  maxAge: 600000
})

const cachedAxios = axios.create({
  adapter: cache.adapter
})

module.exports = async (token) => {
  try {
    const { data: { jwks_uri: jwksUri } } = await cachedAxios.get(OPENID_URL)
    const { data: { keys } } = await cachedAxios.get(jwksUri)
    const tokenDecoded = jwt.decode(token, { complete: true })
    const matchingKey = keys.find(key => key.x5t === tokenDecoded.header.x5t)

    if (!matchingKey) {
      throw Error('x5t in header is not valid!')
    }

    const publicKey = `-----BEGIN CERTIFICATE-----\n${matchingKey.x5c}\n-----END CERTIFICATE-----`

    jwt.verify(token, publicKey)
    return jwt.decode(token)
  } catch (error) {
    throw error
  }
}
