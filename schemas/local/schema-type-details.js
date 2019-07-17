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

const schemaType = new GraphQLObjectType({
  name: 'Details',
  fields: () => ({
    gender: {
      description: 'Gender of person',
      type: GraphQLString,
      resolve: (parent) => parent.gender
    },
    alive: {
      description: 'True if person is alive',
      type: GraphQLBoolean,
      resolve: (parent) => parent.alive
    }
  })
})

module.exports = schemaType
