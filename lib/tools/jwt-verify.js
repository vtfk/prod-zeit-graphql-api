const jwt = require('jsonwebtoken')
const config = require('../../config')

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.replace(/bearer /i, '')
    // Throws if invalid
    jwt.verify(token, config.SERVICE_JWT)
    
  } catch (error) {
    res.status(401).send("[401] Not authorized")
    return
  }
  next()
}