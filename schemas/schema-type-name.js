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
  name: 'Name',
  fields: () => ({
    fullname: {
      type: GraphQLString,
      description: 'Fullname of person',
      resolve: (parent) => parent.fullName
    },
    firstname: {
      type: GraphQLString,
      description: 'Firstname of person',
      resolve: (parent) => parent.firstName
    },
    middlename: {
      type: GraphQLString,
      description: 'Middlename of person',
      resolve: (parent) => parent.middleName
    },
    surname: {
      type: GraphQLString,
      description: 'Surname of person',
      resolve: (parent) => parent.lastName
    }
  })
})

module.exports = schemaType
