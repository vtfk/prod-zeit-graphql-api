const express = require('express')
const graphqlHTTP = require('express-graphql')
const Dataloader = require('dataloader')
const birthdateFromId = require('birthdate-from-id')
const getAge = require('get-age')
const getKor = require('./lib/lookup-kor')
const getDsf = require('./lib/lookup-dsf')


// Caching per request.
function createLoaders() {
  return {
    birthdateFromId: birthdateFromId,
    getAge: getAge,
    getKor: new Dataloader(keys => getKor(keys)),
    getDsf: new Dataloader(keys => getDsf(keys, 'hentDetaljer'))
  }
}

try {
  const schema = require('./schemas/person-schema')
  const app = express()

  // TODO: Add JWT auth

  app.use('/graphql', graphqlHTTP( req => {
    return {
      schema: schema,
      context: createLoaders(),
      graphiql: true
    }
  }))

  app.listen(4000)

  console.log('Running a GraphQL API server at localhost:4000/graphql')
  
} catch (error) {
  throw error
}