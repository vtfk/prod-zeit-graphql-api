const axios = require('axios')
const jwt = require('jsonwebtoken')
const { logger } = require('./tools/logger')
const { IDENTITY_MAPPER_URL, IDENTITY_MAPPER_JWT } = require('../config')

const isEmail = (email) => { return /^.+@.+\..+$/.test(email) }
const isPersonalId = (uid) => { return /\d{11}/.test(uid) }

module.exports = async (ids) => {
  ids = Array.isArray(ids) ? ids : [ids]
  return Promise.all(ids.map(async (id) => {
    try {
      logger('info', ['lookup-id-mapper', 'getting details from id-mapper', id, 'start'])
      const token = jwt.sign({}, IDENTITY_MAPPER_JWT)
      const header = { headers: { Authorization: token } }

      let person = {}

      if (isEmail(id)) {
        const { data } = await axios.get(`${IDENTITY_MAPPER_URL}/identities/upn/${id}`, header)
        person = data
      } else if (isPersonalId(id)) {
        const { data } = await axios.get(`${IDENTITY_MAPPER_URL}/identities/fnr/${id}`, header)
        person = data
      }

      if (!person) throw Error('User was not found in identity-mapper')

      logger('info', ['lookup-id-mapper', 'getting details from id-mapper', id, 'done'])
      return person
    } catch (error) {
      logger('error', ['lookup-id-mapper', 'getting details from id-mapper', id, 'error'])
      throw error
    }
  }))
}
