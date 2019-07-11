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

const { PersonType } = require('./schema-type-person')

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      persons: {
        type: new GraphQLList(PersonType),
        args: {
          personalId: {
            type: new GraphQLList(GraphQLString),
            description: '[11 chars] This is an unique ID for persons in Norway. AKA fødselsnummer'
          }
        },
        resolve: withAuth( ['MACHINE', 'ADMIN'], (root, args, context) => {
          if (!args.personalId) throw Error(`Parameter 'personalId' is required`)
          context.logger('info', ['person-schema', 'Start', 'Num-ids', args.personalId.length])

          return args.personalId.map(id => {
            // Check if id is exactly 11 digits using regex
            // Valid ids will be processed.
            if (!(RegExp(/^\d{11}$/).exec(id))) {
              context.logger('error', ['person-schema', 'id-wrong-format'])
              throw Error(`Parameter 'personalId' with value '${id}' is not 11 chars or contains non-integer characters`)
            }

            return { id: id }
          })
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
