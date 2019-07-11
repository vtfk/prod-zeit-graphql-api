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

// Currently not in use see: './schema-type-person.js'

const PersonType = require('./schema-type-person').PersonType

const schemaType = new GraphQLObjectType({
  name: 'Family',
  fields: () => ({
    mother: {
      description: 'Mother of person',
      type: PersonType,
      resolve: (parent) => ({ id: parent.motherIdNumber })
    },
    father: {
      description: 'Father of person',
      type: PersonType,
      resolve: (parent) => ({ id: parent.fatherIdNumber })
    },
    spouse: {
      description: 'Spouse of person',
      type: PersonType,
      resolve: (parent) => ({ id: parent.spouseIdNumber })
    },
    children: {
      description: 'Children of person',
      type: new GraphQLList(PersonType),
      resolve: (parent) => parent.children.map(child => ({ id: child.childIdNumber }))
    }
  })
})

module.exports = schemaType
