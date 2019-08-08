/* eslint-disable no-unused-vars */
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
  validateSchema
} = require('graphql')
/* eslint-enable no-unused-vars */

const AuthType = require('./schema-type-auth')

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      auth: {
        type: AuthType,
        resolve: (root, args, context) => {
          context.logger('info', ['auth-schema', 'Start'])
          return context.auth.session.decodedToken.payload
        }
      }
    })
  })
})

// Schema validation, throws if error.
const schemaErrors = validateSchema(schema)
if (schemaErrors.length > 0) {
  throw Error(`Error in schema: \n${schemaErrors}`)
}

module.exports = schema
