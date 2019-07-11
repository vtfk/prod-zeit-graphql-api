const authenticateUser = require('./lib/tools/authenticate-user')
const getContextTools = require('./lib/tools/get-context-tools')
const getSchema = require('./schemas/merge-schemas')
const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const { logConfig } = require('./lib/tools/logger')
const nanoid = require('nanoid')

module.exports = async (req, res) => {
  logConfig({}, nanoid())

  const app = express()

  await authenticateUser.authenticate(req, res)

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
