const config = require('./config')
const jwtAuthVerify = require('./lib/tools/jwt-verify')
const jwtAuthExpiry = require('./lib/tools/jwt-expiry')
const getContextTools = require('./lib/tools/get-context-tools')
const express = require('express');
const { ApolloServer } = require('apollo-server-express');

async function createServer() {
  const app = express();
  app.use('/', jwtAuthVerify)
  app.use('/', jwtAuthExpiry)

  const getSchema = require('./remote-schemas/merge-schemas')
  const schema = await getSchema()
  const server = new ApolloServer({
    schema: schema,
    context: getContextTools(),
    introspection: true,
    playground: true
  })

  server.applyMiddleware({ app });
  app.get(`${server.graphqlPath}`)
  
  return app
}

module.exports = createServer().then(app => {
  if (config.LOCAL_DEV) {
    app.listen(4000)
    console.log(`Local server running at http://localhost:4000/graphql`)
  }
})