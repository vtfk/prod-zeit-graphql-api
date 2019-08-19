const jwt = require('jsonwebtoken')
const { ApolloError, AuthenticationError } = require('apollo-server-express')
const validateAADToken = require('../tools/verify-aad-token')
const lookupIdMapper = require('../lookup-id-mapper')
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
    logger('warn', ['authenticate-user', 'unexpected request', 'checking for authentication header'])
  }

  try {
    user = setUserObject()
    if (!req.headers.authorization) throw new AuthenticationError('Could not find an authorization header')
    user.token = req.headers.authorization.replace(/bearer /i, '')
    user.decodedToken = jwt.decode(user.token, { complete: true })
  } catch (error) {
    logger('warn', ['authenticate-user', error.message])
    user.error = new AuthenticationError('Could not find an authorization header')
  }

  const validAADToken = user.decodedToken.header ? Boolean(user.decodedToken.header.x5t) : false
  if (validAADToken) {
    try {
      logger('info', ['authenticate-user', 'validating AAD token'])
      await validateAADToken(user.token)
      user.isAuthenticated = true
      user.upn = user.decodedToken.payload.upn
      logger('info', ['authenticate-user', 'AAD upn', user.upn])
    } catch (error) {
      handleTokenError(error)
      return
    }
    try {
      const idMapperData = await lookupIdMapper(user.upn).catch(error => {
        user.error = new AuthenticationError(error.message)
      })

      user.personalId = idMapperData[0].fnr
      if (isPersonalId(user.personalId)) {
        logger('info', ['authenticate-user', 'valid AAD-user'])
        user.scope.push('AAD-USER')
      }

      // TODO: Add getting scope based on secGroups (Graph Api)
      if (user.upn === 'ingar.helgesen@vtfk.no') {
        logger('info', ['authenticate-user', 'valid Admin user'])
        user.scope.push('ADMIN')
      }
      logger('info', ['authenticate-user', 'AAD token', 'valid', 'seconds to expiry', Math.floor((user.decodedToken.payload.exp) - Date.now() / 1000)])
    } catch (error) {
      logger('error', ['authenticate-user', 'AAD token', 'error', error])
    }
  } else {
    try {
      logger('info', ['authenticate-user', 'validating machine token'])
      jwt.verify(user.token, SERVICE_JWT, { maxAge: SERVICE_JWT_EXPIRY_TIME })
      user.isAuthenticated = true
      user.scope.push('MACHINE')
      logger('info', ['authenticate-user', 'machine token', 'valid'])
      return
    } catch (error) {
      handleTokenError(error)
    }
  }
}

function handleTokenError (error) {
  logger('error', ['authenticate-user', 'invalid token!', error])
  if (error instanceof jwt.TokenExpiredError) {
    user.error = new AuthenticationError('Not authorized! Token has expired.')
  } else if (error instanceof jwt.JsonWebTokenError) {
    user.error = new AuthenticationError('Not authorized! Invalid token.')
  } else {
    user.error = new ApolloError(error.message)
  }
}

function setUserObject () {
  return {
    personalId: '',
    upn: '',
    scope: [],
    isAuthenticated: false,
    token: '',
    decodedToken: {},
    error: undefined
  }
}

function isPersonalId (personalId) {
  return RegExp(/^\d{11}$/).exec(personalId)
}
