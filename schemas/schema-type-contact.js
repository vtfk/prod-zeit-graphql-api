const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean
} = require('graphql')


const MobileType = require('./schema-type-mobile')
const EmailType = require('./schema-type-email')

const schemaType = new GraphQLObjectType({
  name: 'PersonContactData',
  fields: () => ({
    reserved: {
      description: 'True if person is reserved in KOR',
      type: GraphQLBoolean,
      resolve: (parent) => parent.reservasjon === 'NEI' ? false : true
    },
    status: {
      description: 'Returns (AKTIV | SLETTET | IKKE_REGISTRERT) based on status at KOR',
      type: GraphQLString,
      resolve: (parent) => parent.status
    },
    email: {
      type: EmailType,
      resolve: (parent) => parent.kontaktinformasjon
    },
    mobile: {
      type: MobileType,
      resolve: (parent) => parent.kontaktinformasjon
    }
  })
})


module.exports = schemaType