const jwt = require('jsonwebtoken')
const config = require('../../config')

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.replace(/bearer /i, '')
    const tokenDecoded = jwt.decode(token)

    if (!tokenDecoded.exp || (tokenDecoded.exp - tokenDecoded.iat) > config.SERVICE_JWT_EXPIRY_TIME) {
      throw Error('Token expiry time too long')
    }
  } catch (error) {
    res.status(401).send('[401] Not authorized  --  Expiry time too long or not existing!')
    return
  }
  next()
}
