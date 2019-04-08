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
const DetailsType = require('./schema-type-details')

// TODO: Seperate FamilyType into own file.
// ./schema-type-family.js
// Ref why it's not:
// https://stackoverflow.com/a/51001564 

const FamilyType = new GraphQLObjectType({
  name: 'Family',
  fields: () => ({
    mother: {
      description: 'Mother of person',
      type: PersonType,
      resolve: (parent) => ({id: parent.motherIdNumber})
    },
    father: {
      description: 'Father of person',
      type: PersonType,
      resolve: (parent) => ({id: parent.fatherIdNumber})
    },
    spouse: {
      description: 'Spouse of person',
      type: PersonType,
      resolve: (parent) => ({id: parent.spouseIdNumber})
    },
    children: {
      description: 'Children of person',
      type: new GraphQLList(PersonType),
      resolve: (parent) => parent.children.map( child => ({id: child.childIdNumber}))
    }
  })
})

const PersonType = new GraphQLObjectType({
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
    details: {
      type: DetailsType,
      resolve: async (parent, args, context) => {
        try {
          return await context.getDsf.load(parent.id)
        } catch (error) {
          throw error
        }
      }
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
    },
    family: {
      type: FamilyType,
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


module.exports = PersonType