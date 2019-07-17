const jwt = require('jsonwebtoken')
const validateAADToken = require('../tools/verify-aad-token')
const { SERVICE_JWT, SERVICE_JWT_EXPIRY_TIME } = require('../../config')
const { logger } = require('./logger')

let user = setUserObject()

module.exports.authDetails = () => ({
  isAuthenticated: user.isAuthenticated,
  scope: user.scope,
  session: user
})

module.exports.authenticate = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return
    } else if (req.body && req.body.operationName === 'IntrospectionQuery') {
      return
    }
  } catch (error) {
    logger('warn', ['unexpected request', 'checking for authentication header'])
  }

  try {
    user = setUserObject()
    if (!req.headers.authorization) throw Error('Could not find an authorization header')
    user.token = req.headers.authorization.replace(/bearer /i, '')
    user.decodedToken = jwt.decode(user.token, { complete: true })
  } catch (error) {
    logger('warn', [error.message])
    user.errorMsg = 'Could not find an authorization header'
    return
  }

  const validAADToken = Boolean(user.decodedToken.header.x5t)
  if (validAADToken) {
    try {
      logger('info', ['validating AAD token'])
      await validateAADToken(user.token)
      user.isAuthenticated = true
      user.upn = user.decodedToken.payload.upn
      // TODO: Add getting scope based on secGroups (Graph Api)
      if (user.upn === 'heli1@t-fk.no') {
        user.scope = ['AAD-USER', 'ADMIN']
        // TODO: Add getting personal id from identitymapper
        user.personalId = process.env.TEST_PID
      }
      logger('info', ['AAD token', 'valid', 'seconds to expiry', Math.floor((user.decodedToken.payload.exp) - Date.now() / 1000)])
      return
    } catch (error) {
      handleTokenError(error)
      return
    }
  } else {
    try {
      logger('info', ['validating machine token'])
      jwt.verify(user.token, SERVICE_JWT, { maxAge: SERVICE_JWT_EXPIRY_TIME })
      user.isAuthenticated = true
      user.scope = ['MACHINE']
      logger('info', ['machine token', 'valid'])
      return
    } catch (error) {
      handleTokenError(error)
      return
    }
  }
}

function handleTokenError(error) {
  logger('error', ['invalid token!', error])
  if (error instanceof jwt.TokenExpiredError) {
    user.errorMsg = 'Not authorized! Token has expired.'
  } else if (error instanceof jwt.JsonWebTokenError) {
    user.errorMsg = 'Not authorized! Invalid token.'
  }
}

function setUserObject() {
  return {
    personalId: '',
    upn: '',
    scope: '',
    isAuthenticated: false,
    token: '',
    decodedToken: {},
    errorMsg: undefined
  }
}