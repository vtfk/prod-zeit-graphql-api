process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
const axios = require('axios')
const generateSystemToken = require('./generate-system-token')

module.exports = async options => {
  axios.defaults.headers.common['Authorization'] = generateSystemToken(options.secret)
  try {
    const { data } = await axios.post(options.url, options.payload)
    return data
  } catch (error) {
    throw error
  }
}
