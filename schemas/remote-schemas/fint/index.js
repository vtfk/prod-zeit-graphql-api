const { HttpLink } = require('apollo-link-http')
const fetch = require('node-fetch')
const { introspectSchema, makeRemoteExecutableSchema } = require('graphql-tools')

module.exports = async () => {
  const link = new HttpLink({ uri: 'https://beta.felleskomponent.no/graphql/graphql', fetch })
  const schema = await introspectSchema(link)

  const executableSchema = makeRemoteExecutableSchema({
    schema,
    link
  })
  return executableSchema
}
