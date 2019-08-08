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
  name: 'Auth',
  fields: () => ({
    expiryTime: {
      description: 'Time when token expires',
      type: GraphQLString,
      resolve: (parent, args, context) => {
        if (!parent.exp) return null
        return new Date(parent.exp * 1000).toISOString()
      }
    },
    expiresIn: {
      description: 'Time until token expires in seconds',
      type: GraphQLInt,
      resolve: (parent, args, context) => {
        const expiresIn = parent.exp - Date.now() / 1000
        return Math.floor(expiresIn)
      }
    },
    issuedAt: {
      description: 'Time when token was issued',
      type: GraphQLString,
      resolve: (parent, args, context) => {
        if (!parent.iat) return null
        return new Date(parent.iat * 1000).toISOString()
      }
    },
    tokenAge: {
      description: 'The token\'s age in seconds',
      type: GraphQLInt,
      resolve: (parent, args, context) => {
        const tokenAge = Date.now() / 1000 - parent.iat
        return Math.floor(tokenAge)
      }
    }
  })
})

module.exports = schemaType
