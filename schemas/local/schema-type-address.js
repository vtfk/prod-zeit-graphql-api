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

const schemaType = new GraphQLObjectType({
  name: 'Address',
  fields: () => ({
    address: {
      type: GraphQLString,
      description: 'The address',
      resolve: (parent) => parent.address
    },
    status: {
      type: AddressStatusType,
      description: 'Contains the current address status',
      resolve: (parent) => parent
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

const AddressStatusType = new GraphQLObjectType({
  name: 'Status',
  fields: () => ({
    code: {
      type: GraphQLInt,
      description: 'The code of the address status',
      resolve: (parent) => {
        return parent.raw.HOV['SPES-KD']
      }
    },
    name: {
      type: GraphQLString,
      description: 'The address status name',
      resolve: (parent) => parent.raw.HOV.SPES
    }
  })
})

module.exports = schemaType
