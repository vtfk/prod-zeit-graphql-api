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
        resolve: (root, args) => {
          if (!args.personalId) throw Error(`Parameter 'personalId' is required`)

          return args.personalId.map(id => {
            // Check if id is exactly 11 digits using regex
            // Valid ids will be processed.
            if (!(RegExp(/^\d{11}$/).exec(id))) {
              throw Error(`Parameter 'personalId' with value '${id}' is not 11 chars or contains non-integer characters`)
            }

            return { id: id }
          })
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
console.log('Validated schema imported...')

module.exports = schema
