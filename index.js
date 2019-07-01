const jwtAuthVerify = require('./lib/tools/jwt-verify')
const jwtAuthExpiry = require('./lib/tools/jwt-expiry')
const getContextTools = require('./lib/tools/get-context-tools')
const getSchema = require('./remote-schemas/merge-schemas')
const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const { logConfig } = require('./lib/tools/logger')
const nanoid = require('nanoid')

module.exports = async (req, res) => {
  logConfig({}, nanoid())

  const app = express()

  // TODO: https://github.com/kkemple/graphql-auth
  
  app.use(jwtAuthVerify)
  app.use(jwtAuthExpiry)

  const schema = await getSchema()
  const server = new ApolloServer({
    schema: schema,
    context: getContextTools(),
    introspection: true,
    playground: true
  })

  server.applyMiddleware({
    app,
    path: '/graphql'
  })

  app.get(`${server.graphqlPath}`)

  app(req, res)
}
