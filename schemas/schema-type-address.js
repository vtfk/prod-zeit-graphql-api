const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean
} = require('graphql')

const schemaType = new GraphQLObjectType({
  name: 'Address',
  fields: () => ({
    address: {
      type: GraphQLString,
      description: 'The address',
      resolve: (parent) => parent.address
    },
    zip: {
      type: GraphQLString,
      description: 'The zip-code',
      resolve: (parent) => parent.zip
    },
    city: {
      type: GraphQLString,
      description: 'The city',
      resolve: (parent) => parent.city
    }
  })
})

module.exports = schemaType
