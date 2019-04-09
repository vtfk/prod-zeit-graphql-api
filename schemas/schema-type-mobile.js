const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean
} = require('graphql')

const schemaType = new GraphQLObjectType({
  name: 'MobileInformation',
  fields: () => ({
    number: {
      description: 'Mobilephone number',
      type: GraphQLString,
      resolve: (parent) => parent.mobiltelefonnummer
    },
    updated: {
      description: 'When the mobilephone number was updated',
      type: GraphQLString,
      resolve: (parent) => parent.mobiltelefonnummer_oppdatert
    },
    lastVerified: {
      description: 'When the mobilephone number was last verified',
      type: GraphQLString,
      resolve: (parent) => parent.mobiltelefonnummer_sist_verifisert
    }
  })
})

module.exports = schemaType
