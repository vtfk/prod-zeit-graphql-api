const axios = require('axios')
const jwt = require('jsonwebtoken')
const { logger } = require('./tools/logger')
const { IDENTITY_MAPPER_URL, IDENTITY_MAPPER_JWT } = require('../config')

module.exports = async (upn) => {
  try {
    logger('info', ['get-personal-id', 'getting personalId for upn', upn, 'start'])
    const token = jwt.sign({}, IDENTITY_MAPPER_JWT)
    const header = { headers: { Authorization: token } }

    const { data } = await axios.get(`${IDENTITY_MAPPER_URL}/identities/upn/${upn}`, header)
    if (!data) throw Error('User was not found in identity-mapper')
    if (!data.fnr) throw Error('User is not registered with an personalId in the identity-mapper')

    logger('info', ['get-personal-id', 'getting personalId for upn', upn, 'done'])
    return data.fnr
  } catch (error) {
    logger('error', ['get-personal-id', 'getting personalId for upn', upn, 'error'])
    throw error
  }
}
