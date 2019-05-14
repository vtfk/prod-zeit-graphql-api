const config = require('./config')
const jwtAuthVerify = require('./lib/tools/jwt-verify')
const jwtAuthExpiry = require('./lib/tools/jwt-expiry')
const getContextTools = require('./lib/tools/get-context-tools')
const getSchema = require('./remote-schemas/merge-schemas')
const express = require('express')
const { ApolloServer } = require('apollo-server-express')

module.exports = async (req, res) => {
  const app = express()
  app.use('/', jwtAuthVerify)
  app.use('/', jwtAuthExpiry)

  const schema = await getSchema()
  const server = new ApolloServer({
    schema: schema,
    context: getContextTools(),
    introspection: true,
    playground: true
  })

  server.applyMiddleware({
    app,
    path: '/'
  })

  app.get(`${server.graphqlPath}`)

  if (config.LOCAL_DEV) {
    app.listen(4000)
    console.log(`Local server running at http://localhost:4000${server.graphqlPath}`)
  }

  app(req, res)
}

// module.exports = createServer()
/* .then(app => {
  if (config.LOCAL_DEV) {
    app.listen(4000)
    console.log(`Local server running at http://localhost:4000/graphql`)
  }
}) */
