const config = require('./config')
const express = require('express')
const graphqlHTTP = require('express-graphql')
const Dataloader = require('dataloader')
const jwt = require('jsonwebtoken')
const birthdateFromId = require('birthdate-from-id')
const getAge = require('get-age')
const getKor = require('./lib/lookup-kor')
const getDsf = require('./lib/lookup-dsf')

// Caching per request.
function createLoaders () {
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

  app.use('/', (req, res, next) => {
    try {
      const token = req.headers.authorization.replace(/bearer /i, '')
      // Throws if invalid
      jwt.verify(token, config.SERVICE_JWT)
      
    } catch (error) {
      res.status(401).send("[401] Not authorized  --  Include correct JWT bearer token")
      return
    }
    next()
  })

  app.use('/', (req, res, next) => {
    try {
      const token = req.headers.authorization.replace(/bearer /i, '')
      const tokenDecoded = jwt.decode(token)

      if (!tokenDecoded.exp || (tokenDecoded.exp - tokenDecoded.iat) > 600) {
        throw Error('Token expiry time too long')
      }
    } catch (error) {
      res.status(401).send("[401] Not authorized  --  Please include a token which expires in less than 10 minutes")
      return
    }
    next()
  })

  app.use('/', graphqlHTTP(req => {
    return {
      schema: schema,
      context: createLoaders(),
      graphiql: true
    }
  }))

  app.get('/')
  //app.listen(4000)

  module.exports = app
  console.log('Server started...')
} catch (error) {
  throw error
}