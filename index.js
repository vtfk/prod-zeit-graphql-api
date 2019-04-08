const express = require('express')
const graphqlHTTP = require('express-graphql')

// Context will be accessible in all schemas
const context = {
  birthdateFromId: require('birthdate-from-id'),
  getAge: require('get-age'),
  getKor: require('./lib/lookup-kor'),
  getDsf: require('./lib/lookup-dsf')
}

try {
  const schema = require('./schemas/person-schema')
  const app = express()

  // TODO: Add JWT auth

  app.use('/graphql', graphqlHTTP({
    schema: schema,
    context: context,
    graphiql: true
  }))

  app.listen(4000)

  console.log('Running a GraphQL API server at localhost:4000/graphql')
  
} catch (error) {
  throw error
}