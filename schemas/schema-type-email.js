const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean
} = require('graphql')

const schemaType = new GraphQLObjectType({
  name: 'EmailInformation',
  fields: () => ({
    address: {
      description: 'Email-address',
      type: GraphQLString,
      resolve: (parent) => parent.epostadresse
    },
    updated: {
      description: 'When the email-address was updated',
      type: GraphQLString,
      resolve: (parent) => parent.epostadresse_oppdatert
    },
    lastVerified: {
      description: 'When the email-address was last verified',
      type: GraphQLString,
      resolve: (parent) => parent.epostadresse_sist_verifisert
    }
  })
})


module.exports = schemaType