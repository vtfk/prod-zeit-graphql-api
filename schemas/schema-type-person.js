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

const ContactType = require('./schema-type-contact')
const NameType = require('./schema-type-name')
const AddressType = require('./schema-type-address')
const DetailsType = require('./schema-type-details')

// TODO: Seperate FamilyType into own file.
// ./schema-type-family.js
// Ref why it's not:
// https://stackoverflow.com/a/51001564

const PersonType = new GraphQLObjectType({
  name: 'Person',
  fields: () => ({
    personalId: {
      type: GraphQLString,
      resolve: (parent) => parent.id
    },
    name: {
      type: NameType,
      resolve: (parent, args, context) => {
        try {
          return context.getDsfDetaljer.load(parent.id)
        } catch (error) {
          throw error
        }
      }
    },
    details: {
      type: DetailsType,
      resolve: (parent, args, context) => {
        try {
          return context.getDsfDetaljer.load(parent.id)
        } catch (error) {
          throw error
        }
      }
    },
    contact: {
      type: ContactType,
      resolve: (parent, args, context) => {
        try {
          return context.getKor.load(parent.id)
        } catch (error) {
          throw error
        }
      }
    },
    address: {
      type: AddressType,
      resolve: (parent, args, context) => {
        try {
          return context.getDsfDetaljer.load(parent.id)
        } catch (error) {
          throw error
        }
      }
    },
    family: {
      type: FamilyType,
      resolve: (parent, args, context) => {
        try {
          return context.getDsfDetaljer.load(parent.id)
        } catch (error) {
          throw error
        }
      }
    },
    guardians: {
      type: GraphQLList(PersonType),
      description: 'Returns the guardians of a person below 18, if 18 or above it returns the same person.',
      resolve: async (parent, args, context) => {
        try {
          if (context.getAge(context.birthdateFromId(parent.id)) < 18) {
            return context.getGuardians(parent.id, context)
          } else {
            return [{ id: parent.id }]
          }
        } catch (error) {
          throw error
        }
      }
    }
  })
})

const FamilyType = new GraphQLObjectType({
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

module.exports.PersonType = PersonType
module.exports.FamilyType = FamilyType
