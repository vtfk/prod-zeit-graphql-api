process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
const axios = require('axios')
const generateSystemToken = require('./generate-system-token')

module.exports = async options => {
  if (options.secret) {
    axios.defaults.headers.common['Authorization'] = generateSystemToken(options.secret)
  }
  if (options.azureSecret) {
    axios.defaults.headers.common['Ocp-Apim-Subscription-Key'] = options.azureSecret
  }

  try {
    const { data } = await axios.post(options.url, options.payload, { timeout: 60000 })
    return data
  } catch (error) {
    throw error
  }
}
