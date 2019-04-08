const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean
} = require('graphql')

const ContactType = require('./schema-type-contact')
const NameType = require('./schema-type-name')
const AddressType = require('./schema-type-address')

const schemaType = new GraphQLObjectType({
  name: 'Person',
  fields: () => ({
    personalId: {
      type: GraphQLString,
      resolve: (parent) => parent.id
    },
    name: {
      type: NameType,
      resolve: async (parent, args, context) => {
        try {
          return await context.getDsf.load(parent.id)
        } catch (error) {
          throw error
        }
      }
    },
    age: {
      type: GraphQLInt,
      // TODO: Get age from DSF instead? Maybe fallback if only option.
      resolve: (parent, args, context) => context.getAge(context.birthdateFromId(parent.id))
    },
    contact: {
      type: ContactType,
      resolve: async (parent, args, context) => {
        try {
          const korPerson = await context.getKor.load(parent.id)
          return korPerson
        } catch (error) {
          throw error
        }
      }
    },
    address: {
      type: AddressType,
      resolve: async (parent, args, context) => {
        try {
          const dsfPerson = await context.getDsf.load(parent.id)
          return dsfPerson
        } catch (error) {
          throw error
        }
      }
    }
  })
})


module.exports = schemaType