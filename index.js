const authenticateUser = require('./lib/tools/authenticate-user')
const getContextTools = require('./lib/tools/get-context-tools')
const getSchema = require('./schemas/merge-schemas')
const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const { logConfig } = require('./lib/tools/logger')
const nanoid = require('nanoid')

const schema = getSchema()

module.exports = async (req, res) => {
  logConfig({}, nanoid())

  const app = express()

  await authenticateUser.authenticate(req, res)

  const server = new ApolloServer({
    schema: await schema,
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
