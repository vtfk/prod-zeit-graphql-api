const express = require('express')
const graphqlHTTP = require('express-graphql')
const jwtAuthVerify = require('./lib/tools/jwt-verify')
const jwtAuthExpiry = require('./lib/tools/jwt-expiry')
const getContextTools = require('./lib/tools/get-context-tools')

try {
  const schema = require('./schemas/person-schema')
  const app = express()

  app.use('/', jwtAuthVerify)

  app.use('/', jwtAuthExpiry)

  app.use('/', graphqlHTTP(req => {
    return {
      schema: schema,
      context: getContextTools(),
      graphiql: true
    }
  }))

  app.get('/')

  if (process.env.LOCAL_DEV) {app.listen(4000)}

  module.exports = app
  console.log('Server started...')
} catch (error) {
  throw error
}
