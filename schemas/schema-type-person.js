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

const AddressType = require('./schema-type-address')
const DetailsType = require('./schema-type-details')
const MobileType = require('./schema-type-mobile')
const EmailType = require('./schema-type-email')

// TODO: Seperate FamilyType into own file.
// ./schema-type-family.js
// Ref why it's not:
// https://stackoverflow.com/a/51001564

const PersonType = new GraphQLObjectType({
  name: 'Person',
  fields: () => ({
    personalId: {
      description: 'The personalID for person',
      type: GraphQLString,
      resolve: async (parent) => parent.id
    },
    fullname: {
      type: GraphQLString,
      description: 'Fullname of person',
      resolve: async (parent, args, context) => {
        try {
          const dsfData = await context.getDsfDetaljer.load(parent.id)
          return dsfData.fullName
        } catch (error) {
          throw error
        }
      }
    },
    firstname: {
      type: GraphQLString,
      description: 'Firstname of person',
      resolve: async (parent, args, context) => {
        try {
          const dsfData = await context.getDsfDetaljer.load(parent.id)
          return dsfData.firstName
        } catch (error) {
          throw error
        }
      }
    },
    middlename: {
      type: GraphQLString,
      description: 'Middlename of person',
      resolve: async (parent, args, context) => {
        try {
          const dsfData = await context.getDsfDetaljer.load(parent.id)
          return dsfData.middleName
        } catch (error) {
          throw error
        }
      }
    },
    surname: {
      type: GraphQLString,
      description: 'Surname of person',
      resolve: async (parent, args, context) => {
        try {
          const dsfData = await context.getDsfDetaljer.load(parent.id)
          return dsfData.lastName
        } catch (error) {
          throw error
        }
      }
    },
    details: {
      description: 'Contains: gender, age and alive',
      type: DetailsType,
      resolve: async (parent, args, context) => {
        try {
          return context.getDsfDetaljer.load(parent.id)
        } catch (error) {
          throw error
        }
      }
    },
    contactReserved: {
      description: 'True if person is reserved in KOR',
      type: GraphQLBoolean,
      resolve: async (parent, args, context) => {
        try {
          const korData = await context.getKor.load(parent.id)
          return korData.reservasjon === 'JA'
        } catch (error) {
          throw error
        }
      }
    },
    status: {
      description: 'Returns (AKTIV | SLETTET | IKKE_REGISTRERT) based on status at KOR',
      type: GraphQLString,
      resolve: async (parent, args, context) => {
        try {
          const korData = await context.getKor.load(parent.id)
          return korData.status
        } catch (error) {
          throw error
        }
      }
    },
    email: {
      description: 'Contains: address, updated, lastverified',
      type: EmailType,
      resolve: async (parent, args, context) => {
        try {
          const korData = await context.getKor.load(parent.id)
          return korData.kontaktinformasjon
        } catch (error) {
          throw error
        }
      }
    },
    mobile: {
      description: 'Contains: number, updated, lastverified',
      type: MobileType,
      resolve: async (parent, args, context) => {
        try {
          const korData = await context.getKor.load(parent.id)
          return korData.kontaktinformasjon
        } catch (error) {
          throw error
        }
      }
    },
    address: {
      description: 'Contains: address, zip, city',
      type: AddressType,
      resolve: async (parent, args, context) => {
        try {
          return context.getDsfDetaljer.load(parent.id)
        } catch (error) {
          throw error
        }
      }
    },
    family: {
      description: 'Contains: mother, father, spouse, children',
      type: FamilyType,
      resolve: async (parent, args, context) => {
        try {
          return context.getDsfDetaljer.load(parent.id)
        } catch (error) {
          throw error
        }
      }
    },
    guardians: {
      description: 'Returns the guardians of a person below 18, if 18 or above it returns the same person.',
      type: GraphQLList(PersonType),
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
