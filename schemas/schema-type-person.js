const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean
} = require('graphql')

const ContactType = require('./schema-type-contact')

const schemaType = new GraphQLObjectType({
  name: 'Person',
  fields: () => ({
    personalId: {
      type: GraphQLString,
      resolve: (parent) => parent.id
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
          const korPerson = await context.getKor(parent.id)
          if(!korPerson) {throw Error('Id was not found in KOR')}
          return korPerson
        } catch (error) {
          throw error
        }
      }
    }
  })
})


module.exports = schemaType