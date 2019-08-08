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
const withAuth = require('graphql-auth').default
const { ForbiddenError } = require('apollo-server-express')

const { PersonType } = require('./schema-type-person')

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      user: {
        description: 'Contains the current user\'s person object, if using a valid AAD token',
        type: PersonType,
        resolve: withAuth(['AAD-USER'], (root, args, context) => {
          if (!context.auth.session.personalId) {
            console.log(JSON.stringify(context.auth, null, 2))
            throw context.auth.error ? context.auth.error : new ForbiddenError(`Context did not contain a personalId`)
          }
          const personalId = context.auth.session.personalId
          context.logger('info', ['person-schema', 'Start'])

          // Check if id is exactly 11 digits
          if (!(RegExp(/^\d{11}$/).exec(personalId))) {
            context.logger('error', ['person-schema', 'id-wrong-format'])
            throw Error(`User's personalId is not 11 chars or contains non-integer characters`)
          }

          return { id: personalId }
        })
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
