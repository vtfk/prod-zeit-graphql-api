const { mergeSchemas } = require('graphql-tools')
const promisedSchemas = [
  require('./local/person-schema'),
  require('./local/auth-schema')
//  require('./remote-schemas/fint')()
]
module.exports = async () => {
  const schemas = await Promise.all(promisedSchemas)

  const schema = mergeSchemas({
    schemas
  })
  return schema
}
