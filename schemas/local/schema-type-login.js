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
  name: 'Login information',
  fields: () => ({
    upn: {
      description: 'User\'s upn',
      type: GraphQLString,
      resolve: (parent) => parent.upn
    },
    upnOld: {
      description: 'User\'s old upn, before the merge',
      type: GraphQLString,
      resolve: (parent) => parent.upnOld
    },
    sam: {
      description: 'User\'s sam',
      type: GraphQLString,
      resolve: (parent) => parent.sam
    },
    samOld: {
      description: 'User\'s old sam, before the merge',
      type: GraphQLString,
      resolve: (parent) => parent.samOld
    }
  })
})

module.exports = schemaType
