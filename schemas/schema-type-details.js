const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean
} = require('graphql')

const schemaType = new GraphQLObjectType({
  name: 'Details',
  fields: () => ({
    gender: {
      description: 'Gender of person',
      type: GraphQLString,
      resolve: (parent) => parent.gender
    },
    age: {
      description: 'Age of person',
      type: GraphQLInt,
      resolve: (parent, args, context) => context.getAge(parent.birthDate)
    },
    alive: {
      description: 'True if person is alive',
      type: GraphQLBoolean,
      resolve: (parent) => parent.alive
    }
  })
})

module.exports = schemaType
